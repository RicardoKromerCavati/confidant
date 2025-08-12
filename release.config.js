const config = {
    branches: ['main'],
    tagFormat: '${version}',
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/changelog",
            {
                "changelogFile": "docs/CHANGELOG-${nextRelease.version}.md"
            }
        ],
        [
            "@semantic-release/git",
            {
                "assets": ["docs/*.md"],
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ]
    ]
};

module.exports = config;