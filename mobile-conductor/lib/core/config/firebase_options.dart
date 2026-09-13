import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Opciones Firebase del proyecto MyRide (Android app `com.myriderd.com`).
class DefaultFirebaseOptions {
  const DefaultFirebaseOptions._();

  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      throw UnsupportedError('Firebase web no configurado en MyRide Conductor');
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        throw UnsupportedError(
          'Agregá GoogleService-Info.plist / opciones iOS cuando registres la app iOS en Firebase',
        );
      default:
        throw UnsupportedError(
          'Firebase no soportado en esta plataforma para MyRide Conductor',
        );
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBKFTNrpLnkW5mnvJlGCMTsjUKgu2ufWjk',
    appId: '1:373085225730:android:bcd11149535f84549a381b',
    messagingSenderId: '373085225730',
    projectId: 'myride-1e31b',
    storageBucket: 'myride-1e31b.firebasestorage.app',
  );
}
