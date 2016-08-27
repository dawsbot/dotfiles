(function() {
  module.exports = {
    personalAccessToken: {
      description: 'Your personal GitHub access token',
      type: 'string',
      "default": '',
      order: 1
    },
    gistId: {
      description: 'ID of gist to use for configuration storage',
      type: 'string',
      "default": '',
      order: 2
    },
    gistDescription: {
      description: 'The description of the gist',
      type: 'string',
      "default": 'automatic update by http://atom.io/packages/sync-settings',
      order: 3
    },
    syncSettings: {
      type: 'boolean',
      "default": true,
      order: 4
    },
    blacklistedKeys: {
      description: "Comma-seperated list of blacklisted keys (e.g. 'package-name,other-package-name.config-name')",
      type: 'array',
      "default": [],
      items: {
        type: 'string'
      },
      order: 5
    },
    syncPackages: {
      type: 'boolean',
      "default": true,
      order: 6
    },
    syncKeymap: {
      type: 'boolean',
      "default": true,
      order: 7
    },
    syncStyles: {
      type: 'boolean',
      "default": true,
      order: 8
    },
    syncInit: {
      type: 'boolean',
      "default": true,
      order: 9
    },
    syncSnippets: {
      type: 'boolean',
      "default": true,
      order: 10
    },
    extraFiles: {
      description: 'Comma-seperated list of files other than Atom\'s default config files in ~/.atom',
      type: 'array',
      "default": [],
      items: {
        type: 'string'
      },
      order: 11
    },
    analytics: {
      type: 'boolean',
      "default": true,
      description: "There is Segment.io which forwards data to Google Analytics to track what versions and platforms are used. Everything is anonymized and no personal information, such as source code, is sent. See the README.md for more details.",
      order: 12
    },
    _analyticsUserId: {
      type: 'string',
      "default": "",
      description: "Unique identifier for this user for tracking usage analytics",
      order: 13
    },
    checkForUpdatedBackup: {
      description: 'Check for newer backup on Atom start',
      type: 'boolean',
      "default": true,
      order: 14
    },
    _lastBackupHash: {
      type: 'string',
      "default": '',
      description: 'Hash of the last backup restored or created',
      order: 15
    },
    quietUpdateCheck: {
      type: 'boolean',
      "default": false,
      description: "Mute 'Latest backup is already applied' message",
      order: 16
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3MvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLG1CQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxtQ0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sQ0FIUDtLQUZhO0FBQUEsSUFNZixNQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSw2Q0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sQ0FIUDtLQVBhO0FBQUEsSUFXZixlQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSw2QkFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUywyREFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLENBSFA7S0FaYTtBQUFBLElBZ0JmLFlBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsTUFFQSxLQUFBLEVBQU8sQ0FGUDtLQWpCYTtBQUFBLElBb0JmLGVBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLCtGQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxNQUdBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47T0FKRjtBQUFBLE1BS0EsS0FBQSxFQUFPLENBTFA7S0FyQmE7QUFBQSxJQTJCZixZQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBRlA7S0E1QmE7QUFBQSxJQStCZixVQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBRlA7S0FoQ2E7QUFBQSxJQW1DZixVQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBRlA7S0FwQ2E7QUFBQSxJQXVDZixRQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBRlA7S0F4Q2E7QUFBQSxJQTJDZixZQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLE1BRUEsS0FBQSxFQUFPLEVBRlA7S0E1Q2E7QUFBQSxJQStDZixVQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxrRkFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsTUFHQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO09BSkY7QUFBQSxNQUtBLEtBQUEsRUFBTyxFQUxQO0tBaERhO0FBQUEsSUFzRGYsU0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxNQUVBLFdBQUEsRUFBYSxvT0FGYjtBQUFBLE1BTUEsS0FBQSxFQUFPLEVBTlA7S0F2RGE7QUFBQSxJQThEZixnQkFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLE1BQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxNQUVBLFdBQUEsRUFBYSw4REFGYjtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0EvRGE7QUFBQSxJQW1FZixxQkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsc0NBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FwRWE7QUFBQSxJQXdFZixlQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLE1BRUEsV0FBQSxFQUFhLDZDQUZiO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQXpFYTtBQUFBLElBNkVmLGdCQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLE1BRUEsV0FBQSxFQUFhLGlEQUZiO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQTlFYTtHQUFqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/lib/config.coffee
