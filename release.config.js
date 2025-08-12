const config = {
    branches: ['main'],
    tagFormat: '${version}',
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/github", {
                "assets": [
                    {
                        "path": "dist.zip",
                        "label": "Build result (zip)"
                    },
                    {
                        path: 'CHANGELOG.md'
                    }
                ],
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ]
    ]
};

module.exports = config;