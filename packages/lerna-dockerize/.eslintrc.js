module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        }
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "rules": {
        "@typescript-eslint/indent": [
            "error",
            4,
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "error",
        "comma-dangle": [
            "error",
            {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "always-multiline"
            }
        ],
        "quotes": [
            "error",
            "single",
            {
                "allowTemplateLiterals": true,
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "eol-last": "error",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-len": [
            "error",
            {
                "code": 160
            }
        ],
        "no-console": [
            "error",
            {
                "allow": [
                    "log",
                    "info",
                    "warn",
                    "table",
                    "error",
                    "timeStamp",
                ]
            }
        ],
        "@typescript-eslint/explicit-function-return-type": [
            "error"
        ],
        "@typescript-eslint/type-annotation-spacing": [
            "error",
            {
                "before": false,
                "after": true,
                overrides: {
                    arrow: { before: true, after: true }
                }
            }
        ]
    }
};
