const config = {
    // branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        ["@semantic-release/git", {
            // "assets": ["backend/*.js"],
            "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            // assets are included in release. 
            // message defines the commit message that is used when updating repo. 
        }],
        '@semantic-release/github',
        ["@semantic-release/npm", {
            "npmPublish": false,
          }],
    ]
};

module.exports = config;