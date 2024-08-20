const COMMIT_TYPES = [
  { type: 'feat', release: 'minor', section: '🎛️ New Features' },
  { type: 'fix', release: 'patch', section: '🐛️ Bug Fixes' },
  { type: 'docs', release: 'patch', section: '📝 Documentation Changes' },
  { type: 'refactor', release: 'patch', section: '💅 Code Refactoring' },
  { type: 'test', release: 'patch', section: '🧪 Tests' },
  { type: 'perf', release: 'patch', section: '🚀 Performance Improvements' },
  { type: 'build', release: 'patch', section: '🛠️ Build System' },
  { type: 'ci', release: 'patch', section: '🚦️ Continuous Integration' }
]

module.exports = {
  branches: ['main', { name: 'dev', prerelease: true }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { breaking: true, release: 'major' },
          { revert: true, release: 'patch' },
          ...COMMIT_TYPES.map(({ section, ...rest }) => rest)
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      { preset: 'conventionalcommits', presetConfig: { types: COMMIT_TYPES } }
    ],
    '@semantic-release/github',
    ['@semantic-release/npm', { pkgRoot: 'dist/ui' }]
  ]
}
