/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

var {XOClient} = require('./xo_client')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

var enc = new TextEncoder('utf8');

const trustAnchorEntity = ['Energistyrelsen', 'veryEnergiPublic','trust-anchor','create'].join(',');
let encodedTrustAnchorEntity = Buffer.from(trustAnchorEntity, 'utf8').toString('base64');

const entity = ['dst', 'veryPublic','Energistyrelsen','create'].join(',');
let encodedEntity = Buffer.from(entity, 'utf8').toString('base64');

var client = new XOClient("jack");
client.create(encodedTrustAnchorEntity, 'wow', 'trust-anchor', 'Energistyrelsen');
//client.create(encodedEntity, 'veryEnergiPublic', 'Energistyrelsen', 'dst');
