const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../src/middleware/auth.middleware');

describe('# Auth middleware', function () {
	it('Should throw an error if the auth header is not present', function () {
		const req = {
			get: function (headerName) {
				return null;
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
			'Not authenticated'
		);
	});

	it('Should throw an error if the authorization header has an incorrect format', function () {
		const req = {
			get: function (headerName) {
				return 'xyz';
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
			'jwt must be provided'
		);
	});

	it('Should throw an error if the token cannot be verifier', function () {
		const req = {
			get: function (headerName) {
				return 'Bearer xyz';
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it('Should provide user info after decoding the token', function () {
		const req = {
			get: function (headerName) {
				return 'Bearer faketoken';
			},
		};

		sinon.stub(jwt, 'verify');
		jwt.verify.returns({
			userId: 123,
			name: 'Basic Thomas',
			role: 'basic',
			iat: 1606221838,
			ep: 1606223638,
			iss: 'https://www.netguru.com/',
			sub: '123',
		});
		authMiddleware(req, {}, () => {});
		expect(req.userInfo).to.have.property('userId');
		expect(req.userInfo).to.have.property('name');
		expect(req.userInfo).to.have.property('role');
		expect(req.userInfo).to.have.property('iat');
		expect(req.userInfo).to.have.property('ep');
		expect(req.userInfo).to.have.property('iss');
		expect(req.userInfo).to.have.property('sub');
		expect(jwt.verify.called).to.be.true; //expects the jwt.verify method is being called
		jwt.verify.restore();
	});
});
