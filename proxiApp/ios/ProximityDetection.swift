//
//  File.swift
//  proxiApp
//
//  Created by Maximilian Kaufmann on 7/10/23.
//

import Foundation
import CoreBluetooth

@objc(ProximityDetection)
class ProximityDetection : NSObject {
  var cbCentralManager: CBCentralManager!
  var cbPeripheralManager: CBPeripheralManager!
  
  // LEFT OFF HERE: try to get the peripherals without connecting because
  // the connections would disconnect randomly and then wouldn't automatically
  // connect again
  
  // represents cbuuid of this device
  var serviceUUID : CBUUID!
  //var serviceUUID = CBUUID(string: "00000000-0000-0000-0000-002222222222")
  // represents cbuuid's of recommended devices
  var recommendedUUIDs : [CBUUID] = []
  //var recommendedUUIDs = [CBUUID(string: "00000000-0000-0000-0000-001111111111")]
  
  // a temp storage in memory for a peripheral that is about to be connected to
  var peripherals: [CBPeripheral] = []
  
  // represents minimum distance to connect to device
  var connectionDistance : Int!
  
  // holds system assigned uuid -> proxi uuid
  var discoveredPeripherals = Dictionary<String, String>()
  
  override init() {
    print("initializer1")
    super.init()
  }
  
  @objc
  func initializeProxi(_ thisUUID : String, recommendedUUIDs : [String], connectionDistance: Int) {
    print("initializer2")
    self.cbCentralManager = CBCentralManager(delegate: self, queue: nil)
    self.cbPeripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    
    self.serviceUUID = CBUUID(string: thisUUID)
    
    for currUUID in recommendedUUIDs {
      self.recommendedUUIDs.append(CBUUID(string: currUUID))
    }
    
    self.connectionDistance = connectionDistance
  }
  
  // expose this to js, this gets the list of connected peripherals with specified uuid's
  @objc
  func getCurrentConnections(_ callback:RCTResponseSenderBlock) -> [CBPeripheral] {
    var connected = self.cbCentralManager.retrieveConnectedPeripherals(withServices: recommendedUUIDs)
    // to return a list of UUID's as strings
    var result: [String] = []
    
    for res in connected {
      result.append(res.identifier.uuidString)
    }
    
    print(result)
    callback([result])
    return connected
  }
  
  @objc
  func retrievePeripherals(_ callback:RCTResponseSenderBlock) {
    var uuids: [UUID] = []
    
    for uuidKey in discoveredPeripherals.keys {
      if let currUUID = UUID(uuidString: uuidKey) {
        uuids.append(currUUID)
      }
    }
    
    var result = self.cbCentralManager.retrievePeripherals(withIdentifiers: uuids)
    
    //print(result[0].readRSSI())
    print(result)
    
    callback([result])
  }
  
  @objc
  func isScanning(_ callback:RCTResponseSenderBlock) -> Bool {
    print("isScanning")
    //var result = String(self.cbCentralManager.isScanning)
    callback([1111])
    
    return true
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

extension ProximityDetection : CBCentralManagerDelegate {
  // central powers on and starts scanning for recommended UUID's
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    if central.state == .poweredOn {
      //central.scanForPeripherals(withServices: nil, options: nil)
      central.scanForPeripherals(withServices: recommendedUUIDs, options: nil)
      print("Scanning...")
      print(serviceUUID)
      print(recommendedUUIDs)
    }
  }
  
  // central discovers peripheral and connects to it
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                      advertisementData: [String : Any], rssi RSSI: NSNumber) {
    print(peripheral.name)
    print(peripheral.identifier.uuidString)
    if let foundServiceUUIDs = advertisementData[CBAdvertisementDataServiceUUIDsKey] as? [CBUUID] {
      discoveredPeripherals[peripheral.identifier.uuidString] = foundServiceUUIDs[0].uuidString
      print("added to peripherals")
    }
    
    // add peripheral to temp memory
    peripherals.append(peripheral)
    
    // connect to peripheral
    central.connect(peripheral, options: nil)
    
    if RSSI.intValue >= connectionDistance {
      /*
      // if peripheral is not already in memory
      if !connectedPeripherals.contains(peripheral) {
        // add peripheral to temp memory
        peripherals.append(peripheral)
        
        // connect to peripheral
        central.connect(peripheral, options: nil)
      }
       */
    }
  }
  
  // fires when central connects to peripheral
  func centralManager(_ central: CBCentralManager, didConnect: CBPeripheral) {
    print("connected")
  }
  
  // fires when central fails to connect to peripheral
  func centralManager(_ central: CBCentralManager, didFailToConnect: CBPeripheral, error: Error?) {
    print("failed to connect")
  }
  
  // fires when central disconnects from peripheral
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral: CBPeripheral, error: Error?) {
    print("disconnected")
  }
}

extension ProximityDetection : CBPeripheralManagerDelegate {
  // peripheral powers on and starts advertising
  // TODO: see if this is even needed, the phone may be connectable just with having bluetooth on
  // when I connected to maxwell's phone, it's name was "iphone", not "Alexs Phone"
  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    if peripheral.state == .poweredOn {
      print("Advertising")
      let service = CBMutableService(type: serviceUUID, primary: true)
      let characteristic = CBMutableCharacteristic(type: CBUUID(nsuuid: UUID()), properties: [.notify, .read], value: nil, permissions: .readable)
      
      service.characteristics = [characteristic]
      peripheral.add(service)
      let advertisementData = [CBAdvertisementDataLocalNameKey: "Alexs Phone", CBAdvertisementDataServiceUUIDsKey: [serviceUUID]] as [String : Any]
      peripheral.startAdvertising(advertisementData)
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didReadRSSI RSSI: NSNumber, error: Error?) {
    if let error = error {
      // Handle error
      print("Error reading RSSI: \(error.localizedDescription)")
    } else {
      // RSSI value obtained successfully
      let rssiValue = RSSI.intValue
      print("RSSI: \(rssiValue)")
    }
  }
}
