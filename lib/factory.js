var ts = require('typescript');
var logger_1 = require('./logger');
var compiler_host_1 = require('./compiler-host');
var transpiler_1 = require('./transpiler');
var type_checker_1 = require('./type-checker');
var format_errors_1 = require('./format-errors');
var utils_1 = require("./utils");
var logger = new logger_1.default({ debug: false });
function createFactory(options, _resolve, _fetch) {
    options = options || {};
    if (options.tsconfig) {
        var tsconfig = (options.tsconfig === true) ? "tsconfig.json" : options.tsconfig;
        return _resolve(tsconfig)
            .then(function (tsconfigAddress) {
            return _fetch(tsconfigAddress)
                .then(function (tsconfigText) {
                return { tsconfigAddress: tsconfigAddress, tsconfigText: tsconfigText };
            });
        })
            .then(function (_a) {
            var tsconfigAddress = _a.tsconfigAddress, tsconfigText = _a.tsconfigText;
            var ts1 = ts;
            var result = ts1.parseConfigFileText ?
                ts1.parseConfigFileText(tsconfigAddress, tsconfigText) :
                ts1.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);
            if (result.error) {
                format_errors_1.formatErrors([result.error], logger);
                throw new Error("failed to load tsconfig from " + tsconfigAddress);
            }
            var config = Object.assign(result.config.compilerOptions, options);
            var files = result.config.files || [];
            return createServices(config, _resolve, _fetch)
                .then(function (services) {
                if (!services.typeChecker)
                    return services;
                var resolutions = files
                    .filter(function (filename) { return utils_1.isTypescriptDeclaration(filename); })
                    .map(function (filename) { return _resolve(filename, tsconfigAddress); });
                return Promise.all(resolutions)
                    .then(function (resolvedFiles) {
                    resolvedFiles.forEach(function (resolvedFile) {
                        services.typeChecker.registerDeclarationFile(resolvedFile, false);
                    });
                    return services;
                });
            });
        });
    }
    else {
        return createServices(options, _resolve, _fetch);
    }
}
exports.createFactory = createFactory;
function createServices(config, _resolve, _fetch) {
    var host = new compiler_host_1.CompilerHost(config);
    var transpiler = new transpiler_1.Transpiler(host);
    var typeChecker = undefined;
    if (config.typeCheck) {
        typeChecker = new type_checker_1.TypeChecker(host, _resolve, _fetch);
        return _resolve('ts', '')
            .then(function (moduleName) {
            return _resolve(host.getDefaultLibFileName(), moduleName);
        })
            .then(function (defaultLibAddress) {
            typeChecker.registerDeclarationFile(defaultLibAddress, true);
            return { transpiler: transpiler, typeChecker: typeChecker, host: host };
        });
    }
    else {
        return Promise.resolve({ transpiler: transpiler, typeChecker: typeChecker, host: host });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUZhY3RvcnkiLCJjcmVhdGVTZXJ2aWNlcyJdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBWSxFQUFFLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFDakMsdUJBQW1CLFVBQVUsQ0FBQyxDQUFBO0FBQzlCLDhCQUEyQixpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLDJCQUF5QixjQUFjLENBQUMsQ0FBQTtBQUN4Qyw2QkFBMEIsZ0JBQWdCLENBQUMsQ0FBQTtBQUMzQyw4QkFBMkIsaUJBQWlCLENBQUMsQ0FBQTtBQUM3QyxzQkFBc0MsU0FBUyxDQUFDLENBQUE7QUFFaEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFRMUMsdUJBQThCLE9BQXNCLEVBQUUsUUFBeUIsRUFBRSxNQUFxQjtJQUNyR0EsT0FBT0EsR0FBR0EsT0FBT0EsSUFBSUEsRUFBRUEsQ0FBQ0E7SUFFeEJBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1FBQ3JCQSxJQUFJQSxRQUFRQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxLQUFLQSxJQUFJQSxDQUFDQSxHQUFHQSxlQUFlQSxHQUFHQSxPQUFPQSxDQUFDQSxRQUFrQkEsQ0FBQ0E7UUFFMUZBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBO2FBQ3hCQSxJQUFJQSxDQUFDQSxVQUFBQSxlQUFlQTtZQUNwQkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7aUJBQzVCQSxJQUFJQSxDQUFDQSxVQUFBQSxZQUFZQTtnQkFDakJBLE1BQU1BLENBQUNBLEVBQUNBLGlCQUFBQSxlQUFlQSxFQUFFQSxjQUFBQSxZQUFZQSxFQUFDQSxDQUFDQTtZQUN4Q0EsQ0FB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QSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN0QkEsV0FBV0EsR0FBR0EsSUFBSUEsMEJBQVdBLENBQUNBLElBQUlBLEVBQUVBLFFBQVFBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1FBR3REQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQTthQUN0QkEsSUFBSUEsQ0FBQ0EsVUFBQUEsVUFBVUE7WUFDZEEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFBQTtRQUMzREEsQ0FBQ0EsQ0FBQ0E7YUFDREEsSUFBSUEsQ0FBQ0EsVUFBQUEsaUJBQWlCQTtZQUN0QkEsV0FBV0EsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxpQkFBaUJBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1lBQzdEQSxNQUFNQSxDQUFDQSxFQUFDQSxZQUFBQSxVQUFVQSxFQUFFQSxhQUFBQSxXQUFXQSxFQUFFQSxNQUFBQSxJQUFJQSxFQUFDQSxDQUFDQTtRQUN4Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDTEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBQ0EsWUFBQUEsVUFBVUEsRUFBRUEsYUFBQUEsV0FBV0EsRUFBRUEsTUFBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDekRBLENBQUNBO0FBQ0ZBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyogKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQge0NvbXBpbGVySG9zdH0gZnJvbSAnLi9jb21waWxlci1ob3N0JztcbmltcG9ydCB7VHJhbnNwaWxlcn0gZnJvbSAnLi90cmFuc3BpbGVyJztcbmltcG9ydCB7VHlwZUNoZWNrZXJ9IGZyb20gJy4vdHlwZS1jaGVja2VyJztcbmltcG9ydCB7Zm9ybWF0RXJyb3JzfSBmcm9tICcuL2Zvcm1hdC1lcnJvcnMnO1xuaW1wb3J0IHtpc1R5cGVzY3JpcHREZWNsYXJhdGlvbn0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkZWJ1ZzogZmFsc2UgfSk7XG5cbmludGVyZmFjZSBGYWN0b3J5T3V0cHV0IHtcblx0IGhvc3Q6IENvbXBpbGVySG9zdDtcblx0IHRyYW5zcGlsZXI6IFRyYW5zcGlsZXI7XG5cdCB0eXBlQ2hlY2tlcjogVHlwZUNoZWNrZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGYWN0b3J5KG9wdGlvbnM6IFBsdWdpbk9wdGlvbnMsIF9yZXNvbHZlOiBSZXNvbHZlRnVuY3Rpb24sIF9mZXRjaDogRmV0Y2hGdW5jdGlvbik6IFByb21pc2U8RmFjdG9yeU91dHB1dD4ge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRpZiAob3B0aW9ucy50c2NvbmZpZykge1xuXHRcdCBsZXQgdHNjb25maWcgPSAob3B0aW9ucy50c2NvbmZpZyA9PT0gdHJ1ZSkgPyBcInRzY29uZmlnLmpzb25cIiA6IG9wdGlvbnMudHNjb25maWcgYXMgc3RyaW5nO1xuXG5cdFx0IHJldHVybiBfcmVzb2x2ZSh0c2NvbmZpZylcblx0XHRcdC50aGVuKHRzY29uZmlnQWRkcmVzcyA9PiB7XG5cdFx0XHRcdHJldHVybiBfZmV0Y2godHNjb25maWdBZGRyZXNzKVxuXHRcdFx0XHRcdC50aGVuKHRzY29uZmlnVGV4dCA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge3RzY29uZmlnQWRkcmVzcywgdHNjb25maWdUZXh0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoe3RzY29uZmlnQWRkcmVzcywgdHNjb25maWdUZXh0fSkgPT4ge1xuXHRcdFx0XHRsZXQgdHMxID0gdHMgYXMgYW55OyAvLyBzdXBwb3J0IFRTIDEuNi4yIGFuZCA+IDEuN1xuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdHMxLnBhcnNlQ29uZmlnRmlsZVRleHQgP1xuXHRcdFx0XHRcdHRzMS5wYXJzZUNvbmZpZ0ZpbGVUZXh0KHRzY29uZmlnQWRkcmVzcywgdHNjb25maWdUZXh0KSA6XG5cdFx0XHRcdFx0dHMxLnBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb24odHNjb25maWdBZGRyZXNzLCB0c2NvbmZpZ1RleHQpO1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcnMoW3Jlc3VsdC5lcnJvcl0sIGxvZ2dlcik7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gbG9hZCB0c2NvbmZpZyBmcm9tICR7dHNjb25maWdBZGRyZXNzfWApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24ocmVzdWx0LmNvbmZpZy5jb21waWxlck9wdGlvbnMsIG9wdGlvbnMpO1xuXHRcdFx0XHRsZXQgZmlsZXMgPSByZXN1bHQuY29uZmlnLmZpbGVzIHx8IFtdO1xuXG5cdFx0XHRcdHJldHVybiBjcmVhdGVTZXJ2aWNlcyhjb25maWcsIF9yZXNvbHZlLCBfZmV0Y2gpXG5cdFx0XHRcdFx0LnRoZW4oc2VydmljZXMgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKCFzZXJ2aWNlcy50eXBlQ2hlY2tlcikgcmV0dXJuIHNlcnZpY2VzO1xuXG5cdFx0XHRcdFx0XHRsZXQgcmVzb2x1dGlvbnMgPSBmaWxlc1xuXHRcdFx0XHRcdFx0XHQuZmlsdGVyKGZpbGVuYW1lID0+IGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKGZpbGVuYW1lKSlcblx0XHRcdFx0XHRcdFx0Lm1hcChmaWxlbmFtZSA9PiBfcmVzb2x2ZShmaWxlbmFtZSwgdHNjb25maWdBZGRyZXNzKSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbDxzdHJpbmc+KHJlc29sdXRpb25zKVxuXHRcdFx0XHRcdFx0XHQudGhlbihyZXNvbHZlZEZpbGVzID0+IHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlZEZpbGVzLmZvckVhY2gocmVzb2x2ZWRGaWxlID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHNlcnZpY2VzLnR5cGVDaGVja2VyLnJlZ2lzdGVyRGVjbGFyYXRpb25GaWxlKHJlc29sdmVkRmlsZSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzZXJ2aWNlcztcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gY3JlYXRlU2VydmljZXMob3B0aW9ucywgX3Jlc29sdmUsIF9mZXRjaCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZXMoY29uZmlnOiBQbHVnaW5PcHRpb25zLCBfcmVzb2x2ZTogUmVzb2x2ZUZ1bmN0aW9uLCBfZmV0Y2g6IEZldGNoRnVuY3Rpb24pOiBQcm9taXNlPEZhY3RvcnlPdXRwdXQ+IHtcblx0bGV0IGhvc3QgPSBuZXcgQ29tcGlsZXJIb3N0KGNvbmZpZyk7XG5cdGxldCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoaG9zdCk7XG5cdGxldCB0eXBlQ2hlY2tlciA9IHVuZGVmaW5lZDtcblxuXHRpZiAoY29uZmlnLnR5cGVDaGVjaykge1xuXHRcdHR5cGVDaGVja2VyID0gbmV3IFR5cGVDaGVja2VyKGhvc3QsIF9yZXNvbHZlLCBfZmV0Y2gpO1xuXG5cdFx0Ly8gVE9ETyAtIHJlbW92ZSB0aGlzIHdoZW4gX19tb2R1bGVOYW1lIGlzIGF2YWlsYWJsZVxuXHRcdHJldHVybiBfcmVzb2x2ZSgndHMnLCAnJylcblx0XHRcdFx0LnRoZW4obW9kdWxlTmFtZSA9PiB7XG5cdFx0XHRcdFx0IHJldHVybiBfcmVzb2x2ZShob3N0LmdldERlZmF1bHRMaWJGaWxlTmFtZSgpLCBtb2R1bGVOYW1lKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihkZWZhdWx0TGliQWRkcmVzcyA9PiB7XG5cdFx0XHRcdFx0dHlwZUNoZWNrZXIucmVnaXN0ZXJEZWNsYXJhdGlvbkZpbGUoZGVmYXVsdExpYkFkZHJlc3MsIHRydWUpO1xuXHRcdFx0XHRcdHJldHVybiB7dHJhbnNwaWxlciwgdHlwZUNoZWNrZXIsIGhvc3R9O1xuXHRcdFx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt0cmFuc3BpbGVyLCB0eXBlQ2hlY2tlciwgaG9zdH0pO1xuXHR9XG59XG4iXX0=