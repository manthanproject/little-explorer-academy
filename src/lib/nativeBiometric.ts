import { Capacitor } from '@capacitor/core';

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function checkNativeBiometricSupport(): Promise<{ face: boolean; fingerprint: boolean }> {
  if (!isNativePlatform()) return { face: false, fingerprint: false };

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');
    const result = await NativeBiometric.isAvailable();

    return {
      face: result.isAvailable && result.biometryType === 2,
      fingerprint: result.isAvailable && (result.biometryType === 1 || result.biometryType === 3),
    };
  } catch {
    return { face: false, fingerprint: false };
  }
}

export async function authenticateNative(reason: string): Promise<boolean> {
  if (!isNativePlatform()) return false;

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');

    // First check if biometric is available
    const availability = await NativeBiometric.isAvailable();
    if (!availability.isAvailable) {
      console.warn('[Biometric] Not available on this device');
      return false;
    }

    // Show the biometric prompt — NO timeout, let Android handle it
    await NativeBiometric.verifyIdentity({
      reason,
      title: 'Little Explorer Academy',
      subtitle: 'Verify your identity',
      description: reason,
      useFallback: true,
      maxAttempts: 5,
    });

    return true;
  } catch (err) {
    console.warn('[Biometric] Auth failed:', err);
    return false;
  }
}
