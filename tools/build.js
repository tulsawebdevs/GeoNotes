({ 
    appDir: "../www",
    baseUrl: "js",
    dir: "../www-built",
    removeCombined: true,
    mainConfigFile: '../www/js/config.js',
    paths: {
        "app": "app"
    },
    modules: [
        { name: "app" },
        { name: "main" }
    ]
})
    
        
