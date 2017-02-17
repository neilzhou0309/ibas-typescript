/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import { IBOListApplicationView } from "./BOApplications.d";
import { BOApplication } from "./BOApplication";


/**
 * 业务对象列表应用
 */
export abstract class BOListApplication<T extends IBOListApplicationView> extends BOApplication<T> {


}
