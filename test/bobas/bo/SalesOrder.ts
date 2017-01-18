﻿/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as bobas from '../../../src/bobas/bobas';

import { User } from './User';

/**
* 销售订单行对象
*/
export class SalesOrderItem extends bobas.BusinessObject<SalesOrderItem> implements bobas.IBODocumentLine {

    private _docEntry: number;

    get docEntry(): number {
        return this._docEntry;
    }

    set docEntry(value: number) {
        this._docEntry = value;
    }

    private _lineId: number;

    get lineId(): number {
        return this._lineId;
    }

    set lineId(value: number) {
        this._lineId = value;
    }
    private _itemCode: string;

    get itemCode(): string {
        return this._itemCode;
    }

    set itemCode(value: string) {
        this._itemCode = value;
    }
    private _price: number;

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }
    private _quantity: number;

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }
    private _lineTotal: number;

    get lineTotal(): number {
        return this._lineTotal;
    }

    set lineTotal(value: number) {
        this._lineTotal = value;
    }

    private _user: User;

    get user(): User {
        if (bobas.object.isNull(this._user)) {
            this._user = new User();
        }
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }
}
/**
* 销售订单行对象集合
*/
export class SalesOrderItems extends bobas.BusinessObjects<SalesOrderItem> implements bobas.IBODocumentLines<SalesOrderItem>{

    /**
     * 创建并添加子项
     */
    create(): SalesOrderItem {
        let item = new SalesOrderItem();
        this.add(item);
        return item;
    }

}
/**
* 销售订单对象
*/
export class SalesOrder extends bobas.BusinessObject<SalesOrder> implements bobas.IBODocument {

    private _docEntry: number;

    get docEntry(): number {
        return this._docEntry;
    }

    set docEntry(value: number) {
        this._docEntry = value;
    }

    private _customer: string;

    get customer(): string {
        return this._customer;
    }

    set customer(value: string) {
        this._customer = value;
    }

    private _items: SalesOrderItems;

    get items(): SalesOrderItems {
        if (bobas.object.isNull(this._items)) {
            this._items = new SalesOrderItems();
        }
        return this._items;
    }

    set items(value: SalesOrderItems) {
        this._items = value;
    }

    private _user: User;

    get user(): User {
        if (bobas.object.isNull(this._user)) {
            this._user = new User();
        }
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

}
