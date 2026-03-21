import { Capacitor } from '@capacitor/core';

// Dynamically import the biometric plugin only on native
let BiometricAuth: any = null;

async function getBiometricAuth() {
  if (!BiometricAuth && isNativePlatform()) {
    const mod = await import('@aparajita/capacitor-biometric-auth');
    BiometricAuth = mod.BiometricAuth;
  }
  return BiometricAuth;
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function checkNativeBiometricSupport(): Promise<{ face: boolean; fingerprint: boolean }> {
  if (!isNativePlatform()) return { face: false, fingerprint: false };

  try {
    const auth = await getBiometricAuth();
    if (!auth) return { face: false, fingerprint: false };

    const result = await auth.checkBiometry();
    const available = result.isAvailable;
    // biometryType: 1 = touchId/fingerprint, 2 = faceId/face, 3 = irisId
    const biometryType = result.biometryType;

    return {
      face: available && (biometryType === 2 || biometryType === 3),
      fingerprint: available && biometryType === 1,
    };
  } catch {
    return { face: false, fingerprint: false };
  }
}

export async function authenticateNative(reason: string): Promise<boolean> {
  if (!isNativePlatform()) return false;

  try {
    const auth = await getBiometricAuth();
    if (!auth) return false;

    await auth.authenticate({
      reason,
      cancelTitle: 'Cancel',
      allowDeviceCredential: true,
      iosFallbackTitle: 'Use Password',
      androidTitle: 'Little Explorer Academy',
      androidSubtitle: 'Verify your identity',
      androidConfirmationRequired: false,
    });

    return true;
  } catch {
    return false;
  }
}
