import LiquidREPointerABI from './contracts/LiquidREPointerABI.json';
import LiquidREABI from './contracts/LiquidREABI.json';
import LRETLogicABI from './contracts/LRETLogicABI.json';
import IREOLogicABI from './contracts/IREOLogicABI.json';
import ConverterLogicABI from './contracts/ConverterLogicABI.json';
import LiquidFactoryABI from './contracts/LiquidFactoryABI.json';
import LiquidPropertyABI from './contracts/LiquidPropertyABI.json';
import TPEGABI from './contracts/TPEGABI.json';
import RENTABI from './contracts/RENTABI.json';
import RENTLogicABI from './contracts/RENTLogicABI.json';

import {
    address as LiquidREPointerLocal
} from './LiquidREPointerLocal.json';
import {
    address as LiquidREPointerRopsten
} from './LiquidREPointerRopsten.json';
import {
    address as LiquidREPointer
} from './LiquidREPointer.json';
import {
    address as LiquidREPointerDevelopment
} from './LiquidREPointerDevelopment.json';


global.LiquidREPointerABI = LiquidREPointerABI;
global.LiquidREABI = LiquidREABI;
global.LRETLogicABI = LRETLogicABI;
global.IREOLogicABI = IREOLogicABI;
global.ConverterLogicABI = ConverterLogicABI;
global.LiquidFactoryABI = LiquidFactoryABI;
global.LiquidPropertyABI = LiquidPropertyABI;
global.TPEGABI = TPEGABI;
global.RENTABI = RENTABI;
global.RENTLogicABI = RENTLogicABI;

global.LiquidREPointerLocal = LiquidREPointerLocal;
global.LiquidREPointerRopsten = LiquidREPointerRopsten;
global.LiquidREPointer = LiquidREPointer;
global.LiquidREPointerDevelopment = LiquidREPointerDevelopment;

global.currentNetwork = null;

global.cbWrap = (callback, resultFunction, errorFunction) => {
    callback((err, res) => {
        if (err) {
            // call the errorFunction if one was passed in
            if (errorFunction) {
                errorFunction(err);
            } else {
                console.log(err);
            }
        } else if (resultFunction) {
            resultFunction(res);
        }
    });
};