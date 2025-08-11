const config = {
    branches: ['distribution'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/github", {
                "assets": ["dist.zip"],
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ],
        '@semantic-release/git'
    ]
};

module.exports = config;