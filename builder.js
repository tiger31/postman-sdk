const walker = require('acorn-walk');
const acorn = require('acorn');
const path = require('path');
const fs = require('fs');

//TODO to args
const modulesDir = 'core';
const moduleFunctionCallSignature = 'core.get';
const moduleFnTrimmer = /\s*\{(?<body>[\s\S]*)\}\s*/m;

const modulesPath = path.resolve(modulesDir);
const modules = fs.readdirSync(modulesPath);

for (const moduleFile of modules) {
    const fileaPath = path.join(modulesDir, moduleFile);
    const fileContent = fs.readFileSync(fileaPath).toString();

    walker.simple(acorn.parse(fileContent), {
        CallExpression(node) {
            if (!node.callee.object || !node.callee.property)
                return
            const callerFn = [node.callee.object.name, node.callee.property.name].join('.');
            if (callerFn === moduleFunctionCallSignature) {
                const fnArgIndex = node.arguments.findIndex(arg => arg.type.includes('Function'))
                if (fnArgIndex === -1) {
                    throw SyntaxError(`Unparsable module ${moduleFile}`)
                }
                const nodeFn = node.arguments[fnArgIndex];
                const fnBody = fileContent.substring(nodeFn.body.start, nodeFn.body.end);
                const mathces = fnBody.match(moduleFnTrimmer);
                if (!mathces.groups || !mathces.groups.body) {
                    throw SyntaxError(`Module function fount but it's bodu can't be determinde ${moduleFile}`)
                }
                console.log(mathces.groups.body);
            }
        }
    });
}



console.log(modules);
