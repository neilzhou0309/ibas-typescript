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
             * 链接框
             */
            sap.m.Link.extend("sap.extension.m.Link", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {
                },
                /**
                 * 获取绑定值
                 */
                getBindingValue(this: Link): string {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(this: Link, value: string): Link {
                    sap.m.Link.prototype.setText.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setText(this: Link, value: string): Link {
                    return sap.m.Link.prototype.setText.apply(this, arguments);
                },
            });
            /**
             * 数据链接框
             */
            Link.extend("sap.extension.m.DataLink", {
                metadata: {
                    properties: {
                        /** 对象编码 */
                        objectCode: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取对象编码
                 */
                getObjectCode(this: DataLink): string {
                    return this.getProperty("objectCode");
                },
                /**
                 * 设置对象编码
                 * @param value 对象编码
                 */
                setObjectCode(this: DataLink, value: string): DataLink {
                    return this.setProperty("objectCode", ibas.config.applyVariables(value));
                },
                /** 初始化 */
                init(this: DataLink): void {
                    this.attachPress(undefined, (event: sap.ui.base.Event) => {
                        let source: DataLink = <DataLink>event.getSource();
                        if (ibas.objects.isNull(source)) {
                            return;
                        }
                        let objectCode: string = source.getObjectCode();
                        let value: string = source.getBindingValue();
                        if (ibas.strings.isEmpty(objectCode) || ibas.strings.isEmpty(value)) {
                            return;
                        }
                        ibas.servicesManager.runLinkService({
                            boCode: objectCode,
                            linkValue: value
                        });
                    });
                }
            });
            /**
             * 业务仓库数据-连接框
             */
            DataLink.extend("sap.extension.m.RepositoryLink", {
                metadata: {
                    properties: {
                        /** 业务仓库 */
                        repository: { type: "any" },
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                    },
                    events: {}
                },
                renderer: {
                },
                /**
                 * 获取业务仓库实例
                 */
                getRepository(this: RepositoryLink): ibas.BORepositoryApplication {
                    return this.getProperty("repository");
                },
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(this: RepositoryLink, value: ibas.BORepositoryApplication | string): RepositoryLink {
                    return this.setProperty("repository", utils.repository(value));
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo(this: RepositoryLink): repository.IDataInfo {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(this: RepositoryLink, value: repository.IDataInfo | any): RepositoryLink {
                    return this.setProperty("dataInfo", utils.dataInfo(value));
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(this: RepositoryLink, value: string): RepositoryLink {
                    if (this.getBindingValue() !== value) {
                        DataLink.prototype.setBindingValue.apply(this, arguments);
                        if (!ibas.strings.isEmpty(value)) {
                            let dataInfo: repository.IDataInfo = this.getDataInfo();
                            if (ibas.objects.isNull(dataInfo)) {
                                return;
                            }
                            let criteria: ibas.ICriteria = new ibas.Criteria();
                            for (let item of String(value).split(ibas.DATA_SEPARATOR)) {
                                let condition: ibas.ICondition = criteria.conditions.create();
                                condition.alias = dataInfo.key;
                                condition.value = item;
                                if (criteria.conditions.length > 0) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                            }
                            repository.batchFetch(this.getRepository(), this.getDataInfo(), criteria,
                                (values) => {
                                    if (values instanceof Error) {
                                        ibas.logger.log(values);
                                    } else {
                                        let keyBudilder: ibas.StringBuilder = new ibas.StringBuilder();
                                        keyBudilder.map(null, "");
                                        keyBudilder.map(undefined, "");
                                        let textBudilder: ibas.StringBuilder = new ibas.StringBuilder();
                                        textBudilder.map(null, "");
                                        textBudilder.map(undefined, "");
                                        for (let item of values) {
                                            if (keyBudilder.length > 0) {
                                                keyBudilder.append(ibas.DATA_SEPARATOR);
                                            }
                                            if (textBudilder.length > 0) {
                                                textBudilder.append(ibas.DATA_SEPARATOR);
                                                textBudilder.append(" ");
                                            }
                                            keyBudilder.append(item.key);
                                            textBudilder.append(item.text);
                                        }
                                        this.setText(textBudilder.toString());
                                    }
                                }
                            );
                        }
                    }
                    return this;
                },
            });
        }
    }
}
