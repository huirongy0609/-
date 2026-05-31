import AppKit
import AVFoundation
import Foundation

struct Wrapper: Decodable {
  let storyboard: Storyboard
}

struct Storyboard: Decodable {
  let title: String
  let bookTitle: String
  let coverImage: String
  let audio: AudioInfo
  let scenes: [Scene]
}

struct AudioInfo: Decodable {
  let src: String
}

struct Scene: Decodable {
  let id: String
  let type: String
  let title: String
  let subtitle: String?
  let voiceover: String
  let screenText: String
  let quote: String?
  let durationSec: Double
}

let args = CommandLine.arguments
guard args.count >= 5 else {
  fputs("Usage: render_fallback.swift props.json output.mp4 projectRoot\n", stderr)
  exit(2)
}

let propsPath = args[1]
let outputPath = args[2]
let projectRoot = args[3]
let tempVideoPath = args[4]
let width = 1080
let height = 1920
let fps: Int32 = 12

let data = try Data(contentsOf: URL(fileURLWithPath: propsPath))
let wrapper = try JSONDecoder().decode(Wrapper.self, from: data)
let storyboard = wrapper.storyboard

func publicPath(_ src: String) -> String {
  let clean = src.hasPrefix("/") ? String(src.dropFirst()) : src
  return URL(fileURLWithPath: projectRoot).appendingPathComponent("public").appendingPathComponent(clean).path
}

func wrap(_ text: String, every count: Int, maxLines: Int) -> String {
  let chars = Array(text.replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression).trimmingCharacters(in: .whitespacesAndNewlines))
  var lines: [String] = []
  var index = 0
  while index < chars.count && lines.count < maxLines {
    let end = min(index + count, chars.count)
    lines.append(String(chars[index..<end]))
    index = end
  }
  return lines.joined(separator: "\n")
}

func drawRoundedRect(_ rect: CGRect, radius: CGFloat, color: NSColor) {
  let path = NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
  color.setFill()
  path.fill()
}

func drawText(_ text: String, rect: CGRect, size: CGFloat, color: NSColor, weight: NSFont.Weight, align: NSTextAlignment = .left, lineHeight: CGFloat = 1.18) {
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = align
  paragraph.lineSpacing = max(0, size * (lineHeight - 1))
  let attrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: size, weight: weight),
    .foregroundColor: color,
    .paragraphStyle: paragraph
  ]
  (text as NSString).draw(in: rect, withAttributes: attrs)
}

func makePixelBuffer(scene: Scene, cover: NSImage?) throws -> CVPixelBuffer {
  var pixelBuffer: CVPixelBuffer?
  let attrs: [CFString: Any] = [
    kCVPixelBufferCGImageCompatibilityKey: true,
    kCVPixelBufferCGBitmapContextCompatibilityKey: true
  ]
  CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32ARGB, attrs as CFDictionary, &pixelBuffer)
  guard let buffer = pixelBuffer else {
    throw NSError(domain: "FallbackRenderer", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot create pixel buffer"])
  }

  CVPixelBufferLockBaseAddress(buffer, [])
  defer { CVPixelBufferUnlockBaseAddress(buffer, []) }

  guard
    let base = CVPixelBufferGetBaseAddress(buffer),
    let context = CGContext(
      data: base,
      width: width,
      height: height,
      bitsPerComponent: 8,
      bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
      space: CGColorSpaceCreateDeviceRGB(),
      bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
    )
  else {
    throw NSError(domain: "FallbackRenderer", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot create CGContext"])
  }

  let graphics = NSGraphicsContext(cgContext: context, flipped: true)
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = graphics

  let bounds = CGRect(x: 0, y: 0, width: width, height: height)
  let gradient = NSGradient(colors: [
    NSColor(calibratedRed: 0.06, green: 0.09, blue: 0.13, alpha: 1),
    NSColor(calibratedRed: 0.14, green: 0.18, blue: 0.22, alpha: 1),
    NSColor(calibratedRed: 0.49, green: 0.45, blue: 0.34, alpha: 1)
  ])!
  gradient.draw(in: NSBezierPath(rect: bounds), angle: -35)

  NSColor(calibratedWhite: 1, alpha: 0.055).setStroke()
  for x in stride(from: 0, through: width, by: 72) {
    let path = NSBezierPath()
    path.move(to: CGPoint(x: x, y: 0))
    path.line(to: CGPoint(x: x, y: height))
    path.stroke()
  }
  for y in stride(from: 0, through: height, by: 72) {
    let path = NSBezierPath()
    path.move(to: CGPoint(x: 0, y: y))
    path.line(to: CGPoint(x: width, y: y))
    path.stroke()
  }

  if let cover {
    drawRoundedRect(CGRect(x: 760, y: 118, width: 248, height: 352), radius: 20, color: NSColor(calibratedWhite: 0.95, alpha: 0.86))
    let coverRect = CGRect(x: 774, y: 134, width: 220, height: 320)
    cover.draw(in: coverRect, from: .zero, operation: .sourceOver, fraction: 0.88, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
  }

  drawText(scene.subtitle ?? storyboard.bookTitle, rect: CGRect(x: 78, y: 222, width: 680, height: 56), size: 34, color: NSColor(calibratedRed: 0.92, green: 0.77, blue: 0.43, alpha: 1), weight: .heavy)
  drawText(wrap(scene.title, every: 13, maxLines: 3), rect: CGRect(x: 78, y: 300, width: 760, height: 250), size: 68, color: .white, weight: .heavy)

  drawRoundedRect(CGRect(x: 70, y: 610, width: 820, height: 220), radius: 20, color: NSColor(calibratedWhite: 1, alpha: 0.14))
  drawText(wrap(scene.screenText, every: 12, maxLines: 2), rect: CGRect(x: 110, y: 656, width: 740, height: 140), size: 56, color: .white, weight: .heavy)

  drawRoundedRect(CGRect(x: 70, y: 1050, width: 940, height: 310), radius: 18, color: NSColor(calibratedRed: 0.94, green: 0.86, blue: 0.64, alpha: 0.95))
  drawText("金句卡片", rect: CGRect(x: 104, y: 1100, width: 300, height: 42), size: 28, color: NSColor(calibratedRed: 0.55, green: 0.43, blue: 0.17, alpha: 1), weight: .bold)
  drawText(wrap(scene.quote ?? scene.voiceover, every: 17, maxLines: 3), rect: CGRect(x: 104, y: 1155, width: 860, height: 150), size: 40, color: NSColor(calibratedRed: 0.09, green: 0.13, blue: 0.17, alpha: 1), weight: .heavy)

  drawRoundedRect(CGRect(x: 70, y: 1578, width: 940, height: 228), radius: 18, color: NSColor(calibratedWhite: 0.03, alpha: 0.68))
  drawText(wrap(scene.voiceover, every: 24, maxLines: 3), rect: CGRect(x: 104, y: 1622, width: 870, height: 140), size: 34, color: .white, weight: .bold)

  NSGraphicsContext.restoreGraphicsState()
  return buffer
}

func removeIfExists(_ path: String) {
  try? FileManager.default.removeItem(atPath: path)
}

removeIfExists(tempVideoPath)
removeIfExists(outputPath)

let writer = try AVAssetWriter(outputURL: URL(fileURLWithPath: tempVideoPath), fileType: .mp4)
let settings: [String: Any] = [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 6_000_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
  ]
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
  kCVPixelBufferWidthKey as String: width,
  kCVPixelBufferHeightKey as String: height
])

guard writer.canAdd(input) else {
  throw NSError(domain: "FallbackRenderer", code: 3, userInfo: [NSLocalizedDescriptionKey: "Cannot add video input"])
}
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

var frameIndex: Int64 = 0
for scene in storyboard.scenes {
  let buffer = try makePixelBuffer(scene: scene, cover: NSImage(contentsOfFile: publicPath(storyboard.coverImage)))
  let frames = max(1, Int(round(scene.durationSec * Double(fps))))
  for _ in 0..<frames {
    while !input.isReadyForMoreMediaData {
      Thread.sleep(forTimeInterval: 0.01)
    }
    let time = CMTime(value: frameIndex, timescale: fps)
    adaptor.append(buffer, withPresentationTime: time)
    frameIndex += 1
  }
}

input.markAsFinished()
writer.finishWriting {
  if writer.status == .failed {
    fputs(writer.error?.localizedDescription ?? "Video writer failed", stderr)
    exit(1)
  }
}

while writer.status == .writing {
  Thread.sleep(forTimeInterval: 0.05)
}

let audioPath = publicPath(storyboard.audio.src)
guard FileManager.default.fileExists(atPath: audioPath) else {
  try FileManager.default.copyItem(atPath: tempVideoPath, toPath: outputPath)
  exit(0)
}

let composition = AVMutableComposition()
let videoAsset = AVURLAsset(url: URL(fileURLWithPath: tempVideoPath))
let audioAsset = AVURLAsset(url: URL(fileURLWithPath: audioPath))

guard
  let sourceVideoTrack = videoAsset.tracks(withMediaType: .video).first,
  let videoTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)
else {
  try FileManager.default.copyItem(atPath: tempVideoPath, toPath: outputPath)
  exit(0)
}

try videoTrack.insertTimeRange(CMTimeRange(start: .zero, duration: videoAsset.duration), of: sourceVideoTrack, at: .zero)
videoTrack.preferredTransform = sourceVideoTrack.preferredTransform

if let sourceAudioTrack = audioAsset.tracks(withMediaType: .audio).first,
   let audioTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
  let audioDuration = min(audioAsset.duration.seconds, videoAsset.duration.seconds)
  if audioDuration > 0 {
    try? audioTrack.insertTimeRange(CMTimeRange(start: .zero, duration: CMTime(seconds: audioDuration, preferredTimescale: 600)), of: sourceAudioTrack, at: .zero)
  }
}

guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else {
  try FileManager.default.copyItem(atPath: tempVideoPath, toPath: outputPath)
  exit(0)
}
exporter.outputURL = URL(fileURLWithPath: outputPath)
exporter.outputFileType = .mp4
exporter.shouldOptimizeForNetworkUse = true

let semaphore = DispatchSemaphore(value: 0)
exporter.exportAsynchronously {
  semaphore.signal()
}
semaphore.wait()

if exporter.status != .completed {
  fputs(exporter.error?.localizedDescription ?? "Export failed", stderr)
  removeIfExists(outputPath)
  try FileManager.default.copyItem(atPath: tempVideoPath, toPath: outputPath)
}
