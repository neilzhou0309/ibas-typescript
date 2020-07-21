/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path ="../ibas/index.d.ts" />
/// <reference path ="./types/index.d.ts" />

// 最小库标记
const SIGN_MIN_LIBRARY: string = ".min";
// 官方地址
const URL_OFFICIAL: string = "https://openui5.hana.ondemand.com/resources/sap-ui-core.js";
// 本地路径
const URL_LOCAL: string = "openui5/resources/sap-ui-core.js";
// index路径
const URL_INDEX: string = "openui5/index";
// element标记
const URL_SCRIPT_ELEMENT_ID: string = "sap-ui-bootstrap";
/** 创建脚本元素 */
function createScriptElement(): HTMLScriptElement {
    let domScript: HTMLScriptElement = document.createElement("script");
    domScript.setAttribute("id", URL_SCRIPT_ELEMENT_ID);
    domScript.setAttribute("data-sap-ui-bindingSyntax", "complex");
    domScript.setAttribute("data-sap-ui-theme", "sap_belize");
    domScript.setAttribute("data-sap-ui-libs", "sap.m, sap.f, sap.tnt, sap.ui.layout, sap.ui.table, sap.uxap");
    domScript.setAttribute("data-sap-ui-async", "true");
    return domScript;
}
export default class Loader {
    /** 名称 */
    name: string = "openui5";
    /** 根地址 */
    root: string;
    /** 不使用缓存 */
    noCache: boolean;
    /** 使用最小库 */
    minLibrary: boolean;
    /** 运行 */
    run(onCompleted?: (error: Error) => void): void {
        try {
            let domScript: HTMLScriptElement = createScriptElement();
            domScript.src = this.root + URL_LOCAL;
            if (this.noCache === true) {
                domScript.src = domScript.src + ibas.strings.format("?_={0}", ibas.config.get(ibas.CONFIG_ITEM_RUNTIME_VERSION, (new Date()).getTime()));
            }
            let that: this = this;
            let onScriptLoaded: (event: Event) => void = function (event: Event): void {
                if (!this.readyState || "loaded" === this.readyState || "complete" === this.readyState) {
                    // 加载扩展库
                    sap.ui.getCore().attachInit(() => {
                        // 设置默认平台
                        if (sap.ui.Device.system.phone) {
                            ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.PHONE);
                        } else if (sap.ui.Device.system.desktop) {
                            ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.DESKTOP);
                        } else if (sap.ui.Device.system.tablet) {
                            ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.TABLET);
                        } else {
                            ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.COMBINATION);
                        }
                        // 模块require函数
                        let require: Require = ibas.requires.create({
                            context: that.name,
                            baseUrl: that.root + that.name,
                            waitSeconds: ibas.config.get(ibas.requires.CONFIG_ITEM_WAIT_SECONDS, 30)
                        });
                        require([
                            "index" + (that.minLibrary ? SIGN_MIN_LIBRARY : "")
                        ], (error: Error) => {
                            if (onCompleted instanceof Function) {
                                onCompleted(error);
                            }
                        }, (error: Error) => {
                            if (onCompleted instanceof Function) {
                                onCompleted(error);
                            }
                        });
                    });
                }
            };
            // 加载成功
            domScript.onload = (<any>domScript).onreadystatechange = onScriptLoaded;
            // 加载失败
            domScript.onerror = function (): void {
                document.getElementById(URL_SCRIPT_ELEMENT_ID).remove();
                let domScript: HTMLScriptElement = createScriptElement();
                domScript.src = URL_OFFICIAL;
                if (that.noCache === true) {
                    domScript.src = domScript.src + ibas.strings.format("?_={0}", ibas.config.get(ibas.CONFIG_ITEM_RUNTIME_VERSION, (new Date()).getTime()));
                }
                // 加载成功
                domScript.onload = (<any>domScript).onreadystatechange = onScriptLoaded;
                // 加载失败
                domScript.onerror = function (): void {
                    if (onCompleted instanceof Function) {
                        onCompleted(new SyntaxError());
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(domScript);
            };
            document.getElementsByTagName("head")[0].appendChild(domScript);
        } catch (error) {
            if (onCompleted instanceof Function) {
                onCompleted(error);
            }
        }
    }
}