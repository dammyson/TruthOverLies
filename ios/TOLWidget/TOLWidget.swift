//
//  TOLWidget.swift
//  TOLWidget
//
//  Created by Ayobami Ayeni on 9/12/26.
//

import WidgetKit
import SwiftUI

private let appGroup = "group.com.truthoverlies.shared"
private let verseStorageKey = "widget_verse"
private let apiBaseURL = "https://test-api.truthoverlies.cloud/api"

private struct VersePayload: Decodable {
    let text: String
    let reference: String
}

private struct ApiVerseEntry: Decodable {
    let text: String
    let book: String
    let chapter: Int
    let verse: Int
}

private struct VerseData {
    let text: String
    let reference: String
}

private struct PersistedVersePayload: Codable {
    let text: String
    let reference: String
    let updatedAt: String
}

private func localDateKey() -> String {
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = .current
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: Date())
}

private func nextLocalMidnight() -> Date {
    let calendar = Calendar.current
    let now = Date()
    let startOfToday = calendar.startOfDay(for: now)
    return calendar.date(byAdding: .day, value: 1, to: startOfToday) ?? now.addingTimeInterval(86400)
}

private func saveVerseToSharedStore(_ verse: VerseData) {
    guard let defaults = UserDefaults(suiteName: appGroup) else {
        return
    }

    let payload = PersistedVersePayload(
        text: verse.text,
        reference: verse.reference,
        updatedAt: ISO8601DateFormatter().string(from: Date())
    )

    guard let data = try? JSONEncoder().encode(payload),
          let raw = String(data: data, encoding: .utf8)
    else {
        return
    }

    defaults.set(raw, forKey: verseStorageKey)
}

private func loadVerseFromSharedStore() -> VerseData {
    let fallback = VerseData(
        text: "Cast all your anxiety on Him because He cares for you.",
        reference: "1 Peter 5:7"
    )

    guard
        let defaults = UserDefaults(suiteName: appGroup),
        let raw = defaults.string(forKey: verseStorageKey),
        let data = raw.data(using: .utf8),
        let payload = try? JSONDecoder().decode(VersePayload.self, from: data),
        !payload.text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
        !payload.reference.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    else {
        return fallback
    }

    return VerseData(text: payload.text, reference: payload.reference)
}

private func fetchVerseOfTheDay() async -> VerseData? {
    let date = localDateKey()
    guard let url = URL(string: "\(apiBaseURL)/verse-of-the-day?date=\(date)") else {
        return nil
    }

    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.timeoutInterval = 10

    do {
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            return nil
        }

        let entries = try JSONDecoder().decode([ApiVerseEntry].self, from: data)
        guard let first = entries.first else {
            return nil
        }

        return VerseData(
            text: first.text,
            reference: "\(first.book) \(first.chapter):\(first.verse)"
        )
    } catch {
        return nil
    }
}

private func resolveVerseForWidget() async -> VerseData {
    if let remote = await fetchVerseOfTheDay() {
        saveVerseToSharedStore(remote)
        return remote
    }
    return loadVerseFromSharedStore()
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(
            date: Date(),
            configuration: ConfigurationAppIntent(),
            verseText: "The steadfast love of the Lord never ceases; His mercies never come to an end.",
            verseReference: "Lamentations 3:22"
        )
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        let verse = await resolveVerseForWidget()
        return SimpleEntry(
            date: Date(),
            configuration: configuration,
            verseText: verse.text,
            verseReference: verse.reference
        )
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let verse = await resolveVerseForWidget()
        let entry = SimpleEntry(
            date: Date(),
            configuration: configuration,
            verseText: verse.text,
            verseReference: verse.reference
        )
        let nextRefresh = nextLocalMidnight()
        return Timeline(entries: [entry], policy: .after(nextRefresh))
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let verseText: String
    let verseReference: String
}

struct TOLWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) private var family

    private var verseDeepLink: URL {
        let encodedRef = entry.verseReference.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        return URL(string: "godsplace://verse?reference=\(encodedRef)") ?? URL(string: "godsplace://home")!
    }

    private var verseLineLimit: Int {
        switch family {
        case .systemSmall:
            return 4
        case .systemLarge:
            return 6
        default:
            return 5
        }
    }

    @ViewBuilder
    private func quickActions() -> some View {
        if family != .systemSmall {
            HStack(spacing: 8) {
                Link("Bible", destination: URL(string: "godsplace://bible")!)
                    .widgetChipStyle()

                Link("Journal", destination: URL(string: "godsplace://journal/new")!)
                    .widgetChipStyle()

                Link("Saved", destination: URL(string: "godsplace://saved")!)
                    .widgetChipStyle()
            }
        } else {
            Link("Open Bible", destination: URL(string: "godsplace://bible")!)
                .widgetChipStyle()
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text("Verse of the Day")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.white.opacity(0.82))

                    Spacer()

                    Text(entry.date, style: .date)
                        .font(.caption2.weight(.medium))
                        .foregroundStyle(.white.opacity(0.74))
                }

                Text("\"\(entry.verseText)\"")
                    .font(.system(size: family == .systemLarge ? 16 : 14, weight: .semibold, design: .serif))
                    .foregroundStyle(.white)
                    .lineLimit(verseLineLimit)
                    .multilineTextAlignment(.leading)

                Text(entry.verseReference)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white.opacity(0.95))
                    .underline()

                Spacer(minLength: 2)

                quickActions()
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .widgetURL(verseDeepLink)
        .containerBackground(for: .widget) {
            LinearGradient(
                colors: [
                    Color(red: 0.13, green: 0.09, blue: 0.08),
                    Color(red: 0.31, green: 0.22, blue: 0.16),
                    Color(red: 0.53, green: 0.40, blue: 0.24)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}

struct TOLWidget: Widget {
    let kind: String = "TOLWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            TOLWidgetEntryView(entry: entry)
        }
        .contentMarginsDisabled()
        .configurationDisplayName("God's Place")
        .description("See your verse of the day and open Bible actions quickly.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemSmall) {
    TOLWidget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: .smiley,
        verseText: "The steadfast love of the Lord never ceases; His mercies never come to an end.",
        verseReference: "Lamentations 3:22"
    )
    SimpleEntry(
        date: .now,
        configuration: .starEyes,
        verseText: "Fear not, for I am with you; be not dismayed, for I am your God.",
        verseReference: "Isaiah 41:10"
    )
}

private extension View {
    func widgetChipStyle() -> some View {
        self
            .font(.caption2.weight(.semibold))
            .foregroundStyle(.white)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(.white.opacity(0.16), in: Capsule())
    }
}
