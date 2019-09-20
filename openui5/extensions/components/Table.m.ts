﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sap {
    export namespace extension {
        export namespace m {
            /**
             * 表格
             */
            sap.m.Table.extend("sap.extension.m.Table", {
                metadata: {
                    properties: {
                    },
                    events: {
                    }
                },
                renderer: {},
                /** 退出 */
                exit(this: Table): void {
                    let model: any = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    (<any>sap.m.Table.prototype).exit.apply(this, arguments);
                }
            });
            /**
             * 表格列
             */
            sap.m.Column.extend("sap.extension.m.Column", {
                metadata: {
                    properties: {
                    },
                    events: {}
                },
                /** 重构设置 */
                applySettings(this: Column, mSettings: any, oScope?: any): Column {
                    if (mSettings) {
                        if (typeof mSettings.header === "string") {
                            mSettings.header = new sap.m.Text("", {
                                text: mSettings.header
                            });
                        }
                    }
                    return sap.m.Column.prototype.applySettings.apply(this, arguments);
                }
            });
            /**
             * 数据表格
             */
            Table.extend("sap.extension.m.DataTable", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo(this: DataTable): { code: string, name?: string } | string | Function | shell.bo.IBOInfo {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(this: DataTable, value: { code: string, name?: string } | string | Function | shell.bo.IBOInfo): DataTable {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter(): Function {
                    return this.getProperty("propertyFilter");
                },
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value: (property: shell.bo.IBOPropertyInfo) => boolean): DataTable {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings(this: DataTable): DataTable {
                    Table.prototype.applySettings.apply(this, arguments);
                    let dataInfo: any = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    } else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.nameOf(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyColumns.call(this, dataInfo);
                        } else {
                            let info: { code: string, name?: string } = dataInfo;
                            let boRepository: shell.bo.IBORepositoryShell = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: ibas.config.applyVariables(info.code),
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    } else {
                                        propertyColumns.call(this, opRslt.resultObjects.firstOrDefault());
                                    }
                                }
                            });
                        }
                    }
                    return this;
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(this: DataTable, oModel: model.JSONModel, sName?: string): DataTable {
                    let model: model.JSONModel = this.getModel();
                    // 判断是否有有效模型
                    if (model && model.getData()) {
                        let data: any = model.getData();
                        if (!(data.rows instanceof Array && data.rows.length > 0)) {
                            model = undefined;
                        }
                    }
                    // 没有设置过模型，则更新控件绑定信息
                    if (ibas.objects.isNull(model) && !ibas.objects.isNull(oModel)) {
                        // 获取对象信息
                        let data: any = oModel.getData();
                        if (data instanceof Array) {
                            data = data[0];
                        } else if (data.rows instanceof Array) {
                            data = data.rows[0];
                        }
                        if (!ibas.objects.isNull(data)) {
                            let userFields: ibas.IUserFields = data.userFields;
                            if (!ibas.objects.isNull(userFields)) {
                                let bindingInfo: any = this.getBindingInfo("items");
                                if (bindingInfo && bindingInfo.template instanceof sap.m.ColumnListItem) {
                                    let template: sap.m.ColumnListItem = bindingInfo.template;
                                    for (let item of template.getCells()) {
                                        let bindingInfo: any = (<any>item).getBindingInfo("text");
                                        if (!ibas.objects.isNull(bindingInfo)) {
                                            userfields.check(userFields, bindingInfo);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return Table.prototype.setModel.apply(this, arguments);
                }
            });
            function propertyColumns(this: DataTable, boInfo: shell.bo.IBOInfo): void {
                if (!boInfo || !(boInfo.properties instanceof Array)) {
                    return;
                }
                // 查询未存在的属性
                let filter: Function = this.getPropertyFilter();
                let properties: ibas.IList<shell.bo.IBOPropertyInfo> = new ibas.ArrayList<shell.bo.IBOPropertyInfo>();
                for (let item of boInfo.properties) {
                    if (item.editSize <= 0) {
                        continue;
                    }
                    if (item.authorised === ibas.emAuthoriseType.NONE) {
                        continue;
                    }
                    if (filter instanceof Function) {
                        if (filter(item) === false) {
                            continue;
                        }
                    }
                    properties.add(item);
                }
                // 创建未存在的列
                let bindingInfo: any = this.getBindingInfo("items");
                if (bindingInfo && bindingInfo.template instanceof sap.m.ColumnListItem) {
                    let template: sap.m.ColumnListItem = bindingInfo.template;
                    for (let property of properties) {
                        this.addColumn(new Column("", {
                            header: property.description,
                        }));
                        template.addCell(factories.newComponent(property, "Object.2"));
                    }
                }
            }
        }
    }
}