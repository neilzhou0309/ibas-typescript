﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace sap {
    namespace extension {
        namespace m {
            /**
             * 复选框
             */
            class CheckBox extends sap.m.CheckBox {
                /**
                 * 构造
                 * @param {string} sId 唯一标记，不要赋值
                 * @param {any} mSettings 绑定值属性：bindingValue
                 */
                constructor(sId?: string, mSettings?: any);
                /**
                 * 设置属性值
                 * @param sPropertyName 属性名称
                 * @param oValue 值
                 * @param bSuppressInvalidate 立即
                 */
                protected setProperty(sPropertyName: string, oValue: any, bSuppressInvalidate?: boolean): this;
                /**
                 * 绑定属性
                 * @param sName 属性名称
                 * @param oBindingInfo 绑定信息
                 */
                bindProperty(sName: string, oBindingInfo: any): this;
                /**
                 * 获取绑定值
                 */
                getBindingValue(): boolean;
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value: boolean): this;
            }
            /**
             * 带提示-复选框
             */
            class TipsCheckBox extends CheckBox {
                /**
                 * 获取选择时提示
                 */
                getTipsOnSelection(): string;
                /**
                 * 设置选择时提示
                 * @param value 提示
                 */
                setTipsOnSelection(value: string): TipsCheckBox;
            }
        }
    }
}
