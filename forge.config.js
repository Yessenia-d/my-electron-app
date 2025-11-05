module.exports = {
  packagerConfig: {
    asar: true,
    
    // macOS 代码签名（需要 Apple Developer 账号）
    osxSign: process.env.APPLE_IDENTITY ? {
      identity: process.env.APPLE_IDENTITY || 'Developer ID Application: Your Name (TEAM_ID)',
      hardenedRuntime: true,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library'
    } : undefined,
    
    // macOS 公证（需要 Apple Developer 账号）
    osxNotarize: process.env.APPLE_ID ? {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    } : undefined
  },
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Yessenia-d',
          name: 'my-electron-app'
        },
        prerelease: false,
        draft: false  // 自动发布，不创建草稿
      }
    }
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Yessenia-d',
        description: 'A minimal Electron application'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};

