//
//  TOLWidgetLiveActivity.swift
//  TOLWidget
//
//  Created by Ayobami Ayeni on 9/12/26.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct TOLWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct TOLWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TOLWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension TOLWidgetAttributes {
    fileprivate static var preview: TOLWidgetAttributes {
        TOLWidgetAttributes(name: "World")
    }
}

extension TOLWidgetAttributes.ContentState {
    fileprivate static var smiley: TOLWidgetAttributes.ContentState {
        TOLWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: TOLWidgetAttributes.ContentState {
         TOLWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: TOLWidgetAttributes.preview) {
   TOLWidgetLiveActivity()
} contentStates: {
    TOLWidgetAttributes.ContentState.smiley
    TOLWidgetAttributes.ContentState.starEyes
}
