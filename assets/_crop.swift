
import AppKit
import Foundation
let args = CommandLine.arguments
let src = args[1], dst = args[2]
let leftRatio = Double(args[3])!
guard let img = NSImage(contentsOfFile: src) else { exit(1) }
var r = NSRect(origin: .zero, size: img.size)
guard let cg = img.cgImage(forProposedRect: &r, context: nil, hints: nil) else { exit(1) }
let w = cg.width, h = cg.height
let x = Int(Double(w) * leftRatio)
let rect = CGRect(x: x, y: 0, width: w - x, height: h)
guard let cropped = cg.cropping(to: rect) else { exit(1) }
let out = NSBitmapImageRep(cgImage: cropped)
guard let data = out.representation(using: .jpeg, properties: [.compressionFactor: 0.92]) else { exit(1) }
try data.write(to: URL(fileURLWithPath: dst))
