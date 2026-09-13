import WidgetKit
import SwiftUI

private let appGroup = "group.com.truthoverlies.shared"
private let verseStorageKey = "widget_verse"

private struct VersePayload: Decodable {
  let text: String
  let reference: String
}

struct VerseEntry: TimelineEntry {
  let date: Date
  let text: String
  let reference: String
}

struct VerseProvider: TimelineProvider {
  func placeholder(in context: Context) -> VerseEntry {
    VerseEntry(
      date: Date(),
      text: "The steadfast love of the Lord never ceases.",
      reference: "Lamentations 3:22"
    )
  }

  func getSnapshot(in context: Context, completion: @escaping (VerseEntry) -> Void) {
    completion(loadEntry())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<VerseEntry>) -> Void) {
    let entry = loadEntry()
    let nextRefresh = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date().addingTimeInterval(1800)
    completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
  }

  private func loadEntry() -> VerseEntry {
    let fallback = VerseEntry(
      date: Date(),
      text: "Cast all your anxiety on Him because He cares for you.",
      reference: "1 Peter 5:7"
    )

    guard
      let defaults = UserDefaults(suiteName: appGroup),
      let raw = defaults.string(forKey: verseStorageKey),
      let data = raw.data(using: .utf8),
      let payload = try? JSONDecoder().decode(VersePayload.self, from: data)
    else {
      return fallback
    }

    return VerseEntry(date: Date(), text: payload.text, reference: payload.reference)
  }
}

struct TOLWidgetView: View {
  let entry: VerseProvider.Entry

  var body: some View {
    ZStack {
      LinearGradient(
        colors: [Color(red: 0.16, green: 0.10, blue: 0.07), Color(red: 0.33, green: 0.22, blue: 0.14)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )

      VStack(alignment: .leading, spacing: 8) {
        Text("Daily Word")
          .font(.caption.weight(.semibold))
          .foregroundStyle(.white.opacity(0.82))

        Text(entry.text)
          .font(.system(size: 14, weight: .semibold, design: .rounded))
          .foregroundStyle(.white)
          .lineLimit(3)

        Text(entry.reference)
          .font(.caption.weight(.bold))
          .underline()
          .foregroundStyle(.white.opacity(0.95))

        Spacer(minLength: 6)

        HStack(spacing: 8) {
          Link("Bible", destination: URL(string: "godsplace://bible")!)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(.white.opacity(0.16), in: Capsule())

          Link("Journal", destination: URL(string: "godsplace://journal/new")!)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(.white.opacity(0.16), in: Capsule())

          Link("Saved", destination: URL(string: "godsplace://saved")!)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(.white.opacity(0.16), in: Capsule())
        }
        .foregroundStyle(.white)
      }
      .padding(14)
    }
    .widgetURL(URL(string: "godsplace://verse?reference=\(entry.reference.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")"))
  }
}

struct TOLWidget: Widget {
  let kind: String = "TOLWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: VerseProvider()) { entry in
      TOLWidgetView(entry: entry)
    }
    .configurationDisplayName("God's Place")
    .description("See a verse and open quick actions from your Home Screen.")
    .supportedFamilies([.systemMedium, .systemLarge])
  }
}
