//
//  TOLWidgetBundle.swift
//  TOLWidget
//
//  Created by Ayobami Ayeni on 9/12/26.
//

import WidgetKit
import SwiftUI

@main
struct TOLWidgetBundle: WidgetBundle {
    var body: some Widget {
        TOLWidget()
        TOLWidgetControl()
        TOLWidgetLiveActivity()
    }
}
