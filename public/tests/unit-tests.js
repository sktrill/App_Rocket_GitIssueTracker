// tests/unit-tests.js
jest.dontMock('../trimString');
jest.dontMock('../prettifyTextBodyTest');
jest.dontMock('../getTextColour');


// test to see if 140 characters are trimmed, if last word is before 140 characters
describe('trimString', function() {
 it('prints 140chars ending on a clean line or word', function() {
   var trimString = require('../trimString');
   expect(trimString("Life's but a walking shadow, a poor player that struts and frets his hour upon the stage and then is heard no more. It is a tale Told by a complete nincompoop")).toBe("Life's but a walking shadow, a poor player that struts and frets his hour upon the stage and then is heard no more. It is a tale Told by a...");
 });
});

// test to see if 140 characters are trimmed, if last word is whitespace (non-character)
describe('trimString', function() {
 it('prints 140chars ending on a clean line or word', function() {
   var trim = require('../trimString');
   expect(trimString("Life's but a walking shadow, a poor player that struts and frets his hour upon the stage and then is heard no more. It is a tale Told by Jo Doe")).toBe("Life's but a walking shadow, a poor player that struts and frets his hour upon the stage and then is heard no more. It is a tale Told by Jo...");
 });
});

// test to see if 140 characters are trimmed, if just line is being printed
describe('trimString', function() {
 it('prints 140chars ending on a clean line or word', function() {
   var trim = require('../trimString');
   expect(trimString("Life's but a walking shadow.")).toBe("Life's but a walking shadow.");
 });
});

// test to see if text colour contrast works, should return white for dark given background color
describe('getTextColour', function() {
 it('returns appropriate text colour for given background colour', function() {
   var getTextColour = require('../getTextColour');
   expect(getTextColour("C40233")).toBe("white");
 });
});

// test to see if text colour contrast works, should return white for dark given background color
describe('getTextColour', function() {
 it('returns appropriate text colour for given background colour', function() {
   var getTextColour = require('../getTextColour');
   expect(getTextColour("000000")).toBe("white");
 });
});

// test to see if text colour contrast works, should return black for light given background color
describe('getTextColour', function() {
 it('returns appropriate text colour for given background colour', function() {
   var getTextColour = require('../getTextColour');
   expect(getTextColour("ffffff")).toBe("black");
 });
});

// test to check if user links picekd up and linked, should return html with linked github user name
describe('prettifyTextBodyTest', function() {
 it('prettifies text by including link for github users', function() {
   var prettifyTextBodyTest = require('../prettifyTextBodyTest');
   expect(prettifyTextBodyTest("thanks @godot thanks for showing up, though this@shouldnotlink")).toBe("<span>thanks <a href="https://github.com/godot">@g… for showing up, though this@shouldnotlink</span>");
 });
});
