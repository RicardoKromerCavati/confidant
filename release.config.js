const config = {
    branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/github", {
                "assets": {
                    "path": "dist.zip",
                    "label": "Build result (zip)"
                },
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ],
        '@semantic-release/git'
    ]
};

module.exports = config;