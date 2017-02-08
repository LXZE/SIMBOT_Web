import * as mocha from 'mocha';
import * as assert from 'assert';
import * as Geometry from '../src/Geometry';
import { MatchController } from '../src/MatchController';
// import { Map } from '../src/Map';
// import { Robot } from '../src/Robot';
import { Room } from '../src/Room';

describe('Geometry test',function(){
	var testRoom = new Room();
	var MatchCTRL = new MatchController(testRoom);

	it('should return foodPosition',function(){
		assert.deepEqual({x:720, y:210},MatchCTRL.getFoodPosition())
	});


});