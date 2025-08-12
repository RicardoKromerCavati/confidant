const config = {
    branches: ['main'],
    tagFormat: '${version}',
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/github",
            {
                "successComment": "This ${issue.pull_request ? 'pull request' : 'issue'} is included in version ${nextRelease.version}.\n\nCommits on ${branch}:\n\n${commits}"
            }
        ],
        "@semantic-release/npm"
    ]
};

module.exports = config;