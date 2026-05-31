#import <AppKit/AppKit.h>
#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>

static const int W = 1080;
static const int H = 1920;
static const int FPS = 12;

static NSString *PublicPath(NSString *root, NSString *src) {
  NSString *clean = [src hasPrefix:@"/"] ? [src substringFromIndex:1] : src;
  return [[root stringByAppendingPathComponent:@"public"] stringByAppendingPathComponent:clean];
}

static NSString *StringValue(id value, NSString *fallback) {
  return [value isKindOfClass:[NSString class]] ? value : fallback;
}

static NSString *WrapText(NSString *text, NSUInteger every, NSUInteger maxLines) {
  NSString *clean = [[text componentsSeparatedByCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] componentsJoinedByString:@""];
  NSMutableArray *lines = [NSMutableArray array];
  for (NSUInteger i = 0; i < clean.length && lines.count < maxLines; i += every) {
    NSUInteger len = MIN(every, clean.length - i);
    [lines addObject:[clean substringWithRange:NSMakeRange(i, len)]];
  }
  return [lines componentsJoinedByString:@"\n"];
}

static void DrawRounded(CGRect rect, CGFloat radius, NSColor *color) {
  [color setFill];
  [[NSBezierPath bezierPathWithRoundedRect:rect xRadius:radius yRadius:radius] fill];
}

static void DrawText(NSString *text, CGRect rect, CGFloat size, NSColor *color, NSFontWeight weight, NSTextAlignment align) {
  NSMutableParagraphStyle *paragraph = [[NSMutableParagraphStyle alloc] init];
  paragraph.alignment = align;
  paragraph.lineSpacing = size * 0.18;
  NSDictionary *attrs = @{
    NSFontAttributeName: [NSFont systemFontOfSize:size weight:weight],
    NSForegroundColorAttributeName: color,
    NSParagraphStyleAttributeName: paragraph
  };
  [text drawInRect:rect withAttributes:attrs];
}

static CVPixelBufferRef CreateFrame(NSDictionary *storyboard, NSDictionary *scene, NSImage *cover) {
  CVPixelBufferRef buffer = NULL;
  NSDictionary *attrs = @{
    (NSString *)kCVPixelBufferCGImageCompatibilityKey: @YES,
    (NSString *)kCVPixelBufferCGBitmapContextCompatibilityKey: @YES
  };
  CVPixelBufferCreate(kCFAllocatorDefault, W, H, kCVPixelFormatType_32ARGB, (__bridge CFDictionaryRef)attrs, &buffer);
  if (buffer == NULL) {
    return NULL;
  }
  CVPixelBufferLockBaseAddress(buffer, 0);

  CGContextRef ctx = CGBitmapContextCreate(
    CVPixelBufferGetBaseAddress(buffer),
    W,
    H,
    8,
    CVPixelBufferGetBytesPerRow(buffer),
    CGColorSpaceCreateDeviceRGB(),
    kCGImageAlphaNoneSkipFirst
  );

  NSGraphicsContext *graphics = [NSGraphicsContext graphicsContextWithCGContext:ctx flipped:YES];
  [NSGraphicsContext saveGraphicsState];
  [NSGraphicsContext setCurrentContext:graphics];

  CGRect bounds = CGRectMake(0, 0, W, H);
  NSGradient *gradient = [[NSGradient alloc] initWithColors:@[
    [NSColor colorWithCalibratedRed:0.06 green:0.09 blue:0.13 alpha:1],
    [NSColor colorWithCalibratedRed:0.14 green:0.18 blue:0.22 alpha:1],
    [NSColor colorWithCalibratedRed:0.49 green:0.45 blue:0.34 alpha:1]
  ]];
  [gradient drawInBezierPath:[NSBezierPath bezierPathWithRect:bounds] angle:-35];

  [[NSColor colorWithCalibratedWhite:1 alpha:0.055] setStroke];
  for (int x = 0; x <= W; x += 72) {
    NSBezierPath *path = [NSBezierPath bezierPath];
    [path moveToPoint:NSMakePoint(x, 0)];
    [path lineToPoint:NSMakePoint(x, H)];
    [path stroke];
  }
  for (int y = 0; y <= H; y += 72) {
    NSBezierPath *path = [NSBezierPath bezierPath];
    [path moveToPoint:NSMakePoint(0, y)];
    [path lineToPoint:NSMakePoint(W, y)];
    [path stroke];
  }

  if (cover) {
    DrawRounded(CGRectMake(760, 118, 248, 352), 20, [NSColor colorWithCalibratedWhite:0.95 alpha:0.86]);
    [cover drawInRect:CGRectMake(774, 134, 220, 320)
             fromRect:NSZeroRect
            operation:NSCompositingOperationSourceOver
             fraction:0.88
       respectFlipped:YES
                hints:@{NSImageHintInterpolation: @(NSImageInterpolationHigh)}];
  }

  NSString *bookTitle = StringValue(storyboard[@"bookTitle"], @"书籍导读");
  NSString *subtitle = StringValue(scene[@"subtitle"], bookTitle);
  NSString *title = StringValue(scene[@"title"], @"核心观点");
  NSString *screen = StringValue(scene[@"screenText"], @"值得带走的判断");
  NSString *voice = StringValue(scene[@"voiceover"], @"");
  NSString *quote = StringValue(scene[@"quote"], voice);

  DrawText(subtitle, CGRectMake(78, 222, 680, 56), 34, [NSColor colorWithCalibratedRed:0.92 green:0.77 blue:0.43 alpha:1], NSFontWeightHeavy, NSTextAlignmentLeft);
  DrawText(WrapText(title, 13, 3), CGRectMake(78, 300, 760, 250), 68, NSColor.whiteColor, NSFontWeightHeavy, NSTextAlignmentLeft);

  DrawRounded(CGRectMake(70, 610, 820, 220), 20, [NSColor colorWithCalibratedWhite:1 alpha:0.14]);
  DrawText(WrapText(screen, 12, 2), CGRectMake(110, 656, 740, 140), 56, NSColor.whiteColor, NSFontWeightHeavy, NSTextAlignmentLeft);

  DrawRounded(CGRectMake(70, 1050, 940, 310), 18, [NSColor colorWithCalibratedRed:0.94 green:0.86 blue:0.64 alpha:0.95]);
  DrawText(@"金句卡片", CGRectMake(104, 1100, 300, 42), 28, [NSColor colorWithCalibratedRed:0.55 green:0.43 blue:0.17 alpha:1], NSFontWeightBold, NSTextAlignmentLeft);
  DrawText(WrapText(quote, 17, 3), CGRectMake(104, 1155, 860, 150), 40, [NSColor colorWithCalibratedRed:0.09 green:0.13 blue:0.17 alpha:1], NSFontWeightHeavy, NSTextAlignmentLeft);

  DrawRounded(CGRectMake(70, 1578, 940, 228), 18, [NSColor colorWithCalibratedWhite:0.03 alpha:0.68]);
  DrawText(WrapText(voice, 24, 3), CGRectMake(104, 1622, 870, 140), 34, NSColor.whiteColor, NSFontWeightBold, NSTextAlignmentLeft);

  [NSGraphicsContext restoreGraphicsState];
  CGContextRelease(ctx);
  CVPixelBufferUnlockBaseAddress(buffer, 0);
  return buffer;
}

static void RemoveIfExists(NSString *path) {
  [[NSFileManager defaultManager] removeItemAtPath:path error:nil];
}

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc < 5) {
      fprintf(stderr, "Usage: render_fallback props.json output.mp4 projectRoot tempVideo.mp4\n");
      return 2;
    }

    NSString *propsPath = [NSString stringWithUTF8String:argv[1]];
    NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
    NSString *projectRoot = [NSString stringWithUTF8String:argv[3]];
    NSString *tempVideoPath = [NSString stringWithUTF8String:argv[4]];

    NSData *data = [NSData dataWithContentsOfFile:propsPath];
    NSDictionary *wrapper = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    NSDictionary *storyboard = wrapper[@"storyboard"];
    NSArray *scenes = storyboard[@"scenes"];
    if (![scenes isKindOfClass:[NSArray class]] || scenes.count == 0) {
      fprintf(stderr, "Storyboard scenes missing\n");
      return 1;
    }

    RemoveIfExists(outputPath);
    RemoveIfExists(tempVideoPath);

    NSURL *tempURL = [NSURL fileURLWithPath:tempVideoPath];
    NSError *error = nil;
    AVAssetWriter *writer = [AVAssetWriter assetWriterWithURL:tempURL fileType:AVFileTypeMPEG4 error:&error];
    NSDictionary *settings = @{
      AVVideoCodecKey: AVVideoCodecTypeH264,
      AVVideoWidthKey: @(W),
      AVVideoHeightKey: @(H)
    };
    AVAssetWriterInput *input = [AVAssetWriterInput assetWriterInputWithMediaType:AVMediaTypeVideo outputSettings:settings];
    input.expectsMediaDataInRealTime = NO;
    AVAssetWriterInputPixelBufferAdaptor *adaptor = [AVAssetWriterInputPixelBufferAdaptor assetWriterInputPixelBufferAdaptorWithAssetWriterInput:input sourcePixelBufferAttributes:@{
      (NSString *)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_32ARGB),
      (NSString *)kCVPixelBufferWidthKey: @(W),
      (NSString *)kCVPixelBufferHeightKey: @(H),
      (NSString *)kCVPixelBufferCGImageCompatibilityKey: @YES,
      (NSString *)kCVPixelBufferCGBitmapContextCompatibilityKey: @YES
    }];
    [writer addInput:input];
    [writer startWriting];
    [writer startSessionAtSourceTime:kCMTimeZero];

    NSImage *cover = [[NSImage alloc] initWithContentsOfFile:PublicPath(projectRoot, StringValue(storyboard[@"coverImage"], @"/cover.jpg"))];
    int64_t frameIndex = 0;
    for (NSDictionary *scene in scenes) {
      @autoreleasepool {
        double seconds = [scene[@"durationSec"] respondsToSelector:@selector(doubleValue)] ? [scene[@"durationSec"] doubleValue] : 8.0;
        int frames = MAX(1, (int)llround(seconds * FPS));
        for (int i = 0; i < frames; i++) {
          CVPixelBufferRef frame = CreateFrame(storyboard, scene, cover);
          if (frame == NULL) {
            fprintf(stderr, "Cannot create video frame\n");
            return 1;
          }
          while (!input.readyForMoreMediaData) {
            [NSThread sleepForTimeInterval:0.01];
          }
          CMTime time = CMTimeMake(frameIndex, FPS);
          [adaptor appendPixelBuffer:frame withPresentationTime:time];
          frameIndex++;
          CVPixelBufferRelease(frame);
        }
      }
    }

    [input markAsFinished];
    dispatch_semaphore_t writerSem = dispatch_semaphore_create(0);
    [writer finishWritingWithCompletionHandler:^{
      dispatch_semaphore_signal(writerSem);
    }];
    dispatch_semaphore_wait(writerSem, DISPATCH_TIME_FOREVER);
    if (writer.status != AVAssetWriterStatusCompleted) {
      NSString *message = writer.error ? writer.error.description : @"Video writer failed";
      fprintf(stderr, "%s\n", message.UTF8String);
      return 1;
    }

    NSString *audioPath = PublicPath(projectRoot, StringValue([storyboard[@"audio"] objectForKey:@"src"], @"/audio.mp3"));
    if (![[NSFileManager defaultManager] fileExistsAtPath:audioPath]) {
      [[NSFileManager defaultManager] copyItemAtPath:tempVideoPath toPath:outputPath error:nil];
      return 0;
    }

    AVMutableComposition *composition = [AVMutableComposition composition];
    AVURLAsset *videoAsset = [AVURLAsset URLAssetWithURL:[NSURL fileURLWithPath:tempVideoPath] options:nil];
    AVURLAsset *audioAsset = [AVURLAsset URLAssetWithURL:[NSURL fileURLWithPath:audioPath] options:nil];
    AVAssetTrack *sourceVideo = [[videoAsset tracksWithMediaType:AVMediaTypeVideo] firstObject];
    AVMutableCompositionTrack *videoTrack = [composition addMutableTrackWithMediaType:AVMediaTypeVideo preferredTrackID:kCMPersistentTrackID_Invalid];
    [videoTrack insertTimeRange:CMTimeRangeMake(kCMTimeZero, videoAsset.duration) ofTrack:sourceVideo atTime:kCMTimeZero error:nil];
    videoTrack.preferredTransform = sourceVideo.preferredTransform;

    AVAssetTrack *sourceAudio = [[audioAsset tracksWithMediaType:AVMediaTypeAudio] firstObject];
    if (sourceAudio) {
      AVMutableCompositionTrack *audioTrack = [composition addMutableTrackWithMediaType:AVMediaTypeAudio preferredTrackID:kCMPersistentTrackID_Invalid];
      CMTime audioDuration = CMTimeMinimum(audioAsset.duration, videoAsset.duration);
      [audioTrack insertTimeRange:CMTimeRangeMake(kCMTimeZero, audioDuration) ofTrack:sourceAudio atTime:kCMTimeZero error:nil];
    }

    AVAssetExportSession *exporter = [[AVAssetExportSession alloc] initWithAsset:composition presetName:AVAssetExportPresetHighestQuality];
    exporter.outputURL = [NSURL fileURLWithPath:outputPath];
    exporter.outputFileType = AVFileTypeMPEG4;
    exporter.shouldOptimizeForNetworkUse = YES;
    dispatch_semaphore_t exportSem = dispatch_semaphore_create(0);
    [exporter exportAsynchronouslyWithCompletionHandler:^{
      dispatch_semaphore_signal(exportSem);
    }];
    dispatch_semaphore_wait(exportSem, DISPATCH_TIME_FOREVER);

    if (exporter.status != AVAssetExportSessionStatusCompleted) {
      RemoveIfExists(outputPath);
      [[NSFileManager defaultManager] copyItemAtPath:tempVideoPath toPath:outputPath error:nil];
    }
    return 0;
  }
}
