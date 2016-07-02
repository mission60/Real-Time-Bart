'use strict';
var bartInfo = require('../server/bartInfo.js');
var server = require('../server/server.js');
var specialSched = bartInfo.getSpecialSched;
var stationList = bartInfo.getStationList;
var realTimeEstimate = bartInfo.getRealTimeEstimate;
var getAdvisories = bartInfo.getAdvisories;

describe('specialSchedules', function() {
  it('should be a function', function() {
    expect(specialSched instanceof Function).toEqual(true);
    expect(specialSched).toEqual(jasmine.any(Function));
  });

  it('should take a callback function as an input', function() {
    expect(function() { specialSched() }).toThrow('Require a callback!');
  });
});

describe('stationList', function() {
  it('should be a function', function() {
    expect(stationList instanceof Function).toEqual(true);
    expect(stationList).toEqual(jasmine.any(Function));
  });

  it('should take a callback function as an input', function() {
    expect(function() { stationList() }).toThrow('Require a callback!');
  });

  it('response should be in JSON format', function(done) {
    stationList(function(res) {
      expect(typeof res).toEqual('string');
      done();
    });
  });
});

describe('realTimeEstimate', function() {
  it('should be a function', function() {
    expect(realTimeEstimate instanceof Function).toEqual(true);
    expect(realTimeEstimate).toEqual(jasmine.any(Function));
  });

  it('should take a station and a callback function as inputs', function() {
    expect(function() { realTimeEstimate(); }).toThrow('Require a station abbreviation and a callback!');
  });

  it('response should be in JSON format', function(done) {
    stationList(function(res) {
      expect(typeof res).toEqual('string');
      done();
    });
  });
});

describe('getAdvisories', function() {
  it('should be a function', function() {
    expect(getAdvisories instanceof Function).toEqual(true);
    expect(getAdvisories).toEqual(jasmine.any(Function));
  });

  it('should take a callback function as an input', function() {
    expect(function() { getAdvisories(); }).toThrow('Require a callback!');
  });

  it('response should be in JSON format', function(done) {
    stationList(function(res) {
      expect(typeof res).toEqual('string');
      done();
    });
  });
});