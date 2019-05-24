﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace sap {
    namespace extension {
        namespace table {
            /**
             * 表格
             */
            class Table extends sap.ui.table.Table {
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
                 * 获取选择的数据
                 */
                getSelecteds<T>(): ibas.IList<T>;
                /**
                 * 获取未选择的数据
                 */
                getUnSelecteds<T>(): ibas.IList<T>;
                /**
                 * 获取选择类型
                 */
                getChooseType(): ibas.emChooseType;
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(value: ibas.emChooseType): this;
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel: model.JSONModel, sName?: string): this;
                /**
                 * 获取模型
                 * @param sModelName 名称
                 */
                getModel(sModelName?: string | undefined): model.JSONModel;
                /**
                 * 监听下一个数据集事件
                 * @param oData 数据
                 * @param fnFunction 方法
                 * @param oListener 监听者
                 */
                attachNextDataSet(oData: any, fnFunction: Function, oListener?: any): this;
                /**
                 * 移出下一个数据集事件
                 * @param fnFunction 方法
                 * @param oListener 监听者
                 */
                detachNextDataSet(fnFunction: Function, oListener?: any): this;
                /**
                 * 触发下一个数据集事件
                 * @param param 参数
                 */
                protected fireNextDataSet(param: { data: any, }): void;
            }
            /**
             * 表格列
             */
            class Column extends sap.ui.table.Column {
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
            }
            /**
             * 数据表格
             */
            class DataTable extends Table {
                /**
                 * 获取数据信息
                 */
                getDataInfo(): { code: string, name?: string } | string | shell.bo.IBOInfo;
                /**
                 * 设置数据信息
                 * @param value 值
                 */
                setDataInfo(value: { code: string, name?: string } | string | shell.bo.IBOInfo): this;
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter(): Function;
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value: (property: shell.bo.IBOPropertyInfo) => boolean): this;
            }
            /**
             * 数据表格列
             */
            class DataColumn extends Column {
                /**
                 * 获取属性信息
                 */
                getPropertyInfo(): shell.bo.IBOPropertyInfo;
                /**
                 * 设置属性信息
                 * @param value 值
                 */
                setPropertyInfo(value: shell.bo.IBOPropertyInfo): this;
            }
        }
    }
}