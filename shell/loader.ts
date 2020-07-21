/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path ="../ibas/index.d.ts" />

// 解决方法缺失
if (typeof String.prototype.startsWith === undefined) {
    String.prototype.startsWith = function (prefix: string): boolean {
        return this.slice(0, prefix.length) === prefix;
    };
}
if (typeof String.prototype.endsWith === undefined) {
    String.prototype.endsWith = function (suffix: string): boolean {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
// 最小库标记
const SIGN_MIN_LIBRARY: string = ".min";
// ibas index路径
const URL_IBAS_INDEX: string = "ibas/index";
// openui5 loader路径
const URL_OPENUI5_LOADER: string = "openui5/loader";

namespace requires {
    /** 运行时标记 */
    export const runtime: string = (new Date()).getTime().toString();
    /** 创建require方法 */
    export function create(name: string, baseUrl: string): Require;
    /** 创建require方法 */
    export function create(name: string, baseUrl: string, noCache: boolean): Require;
    /** 创建require方法 */
    export function create(): Require {
        let name: string = arguments[0], baseUrl: string = arguments[1], noCache: boolean = arguments[2];
        if (noCache) {
            // 不使用缓存
            let runtime: string = requires.runtime;
            return (<any>window).requirejs.config({
                context: name,
                baseUrl: baseUrl,
                urlArgs: function (id: string, url: string): string {
                    return (url.indexOf("?") === -1 ? "?" : "&") + "_=" + runtime;
                }
            });
        } else {
            return (<any>window).requirejs.config({
                context: name,
                baseUrl: baseUrl
            });
        }
    }
}
class Application {
    /** 名称 */
    name: string = "shell";
    /** 根地址 */
    root: string;
    /** 使用最小库 */
    minLibrary: boolean;
    /** 运行 */
    run(onCompleted?: (error: Error) => void): void {
        // 模块require函数
        let require: Require = ibas.requires.create({
            context: ibas.requires.naming(this.name),
            baseUrl: this.root + this.name,
            waitSeconds: ibas.config.get(ibas.requires.CONFIG_ITEM_WAIT_SECONDS, 30)
        });
        require([
            "index" + (this.minLibrary ? SIGN_MIN_LIBRARY : "")
        ], () => {
            // 加载成功
            let shell: any = (<any>window).shell;
            if (shell === undefined || shell === null) {
                if (onCompleted instanceof Function) {
                    onCompleted(new ReferenceError());
                }
            } else {
                // 运行模块
                let console: ibas.ModuleConsole = new shell.app.Console();
                console.module = this.name;
                console.run();
            }
        }, (error: Error) => {
            if (onCompleted instanceof Function) {
                onCompleted(error);
            }
        });
    }
}
/** 应用程序 */
export default class Loader {
    /** 根地址 */
    root: string;
    /** 不使用缓存 */
    noCache: boolean;
    /** 使用最小库 */
    minLibrary: boolean;
    /** 运行 */
    run(onCompleted?: (error: Error) => void): void {
        try {
            if (this.root === undefined || this.root === null) {
                this.root = document.location.origin
                    + document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/"));
            }
            if (!this.root.endsWith("/")) {
                this.root += "/";
            }
            requires.create("_", this.root, this.noCache)([
                URL_IBAS_INDEX + (this.minLibrary ? SIGN_MIN_LIBRARY : ""),
                URL_OPENUI5_LOADER + (this.minLibrary ? SIGN_MIN_LIBRARY : "")
            ], (_: any, Loader: any) => {
                // 不使用缓存，设置运行版本
                if (this.noCache === true) {
                    ibas.config.set(ibas.CONFIG_ITEM_RUNTIME_VERSION, requires.runtime);
                }
                // 使用最小库
                if (this.minLibrary === true) {
                    ibas.config.set(ibas.CONFIG_ITEM_USE_MINIMUM_LIBRARY, this.minLibrary);
                }
                // 初始化ibas
                ibas.init(() => {
                    // 加载成功，加载ui5
                    let loader: any = new Loader.default();
                    loader.noCache = this.noCache;
                    loader.minLibrary = this.minLibrary;
                    loader.root = this.root;
                    loader.run((error: Error) => {
                        if (error instanceof Error) {
                            if (onCompleted instanceof Function) {
                                onCompleted(error);
                            }
                        } else {
                            let app: Application = new Application();
                            app.root = this.root;
                            app.minLibrary = this.minLibrary;
                            app.run();
                        }
                    });
                });
            }, (error: Error) => {
                if (onCompleted instanceof Function) {
                    onCompleted(error);
                }
            });
        } catch (error) {
            if (onCompleted instanceof Function) {
                onCompleted(error);
            }
        }
    }
}