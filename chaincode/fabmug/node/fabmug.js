/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  async Init(stub) {
    console.info('=========== Instantiated fabMug chaincode ===========');
    await stub.putState('BIG', Buffer.from('1'));
    await stub.putState('SMALL', Buffer.from('2'));
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async queryMug(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting MugNumber ex: Mug01');
    }
    let MugNumber = args[0];

    let MugAsBytes = await stub.getState(MugNumber); //get the Mug from chaincode state
    if (!MugAsBytes || MugAsBytes.toString().length <= 0) {
      throw new Error(MugNumber + ' does not exist: ');
    }
    console.log(MugAsBytes.toString());
    return MugAsBytes;
  }

  async createMug(stub, args) {
    console.info('============= START : Create Mug ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 5');
    }

    await stub.putState(args[0], Buffer.from(args[1]));
    console.info('============= END : Create Mug ===========');
  }
};

shim.start(new Chaincode());
