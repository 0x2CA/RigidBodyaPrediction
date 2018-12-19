const { ccclass, property } = cc._decorator;

@ccclass
export default class RigidBodyaPrediction extends cc.Component {
	@property(cc.RigidBody)
	RigidBody: cc.RigidBody = null;

	@property(cc.Prefab)
	show_prefab: cc.Prefab = null;
	// LIFE-CYCLE CALLBACKS:
	//米/秒^2
	a_y = 0;
	a_x = 0;
	//米/秒
	v_y = 0;
	v_x = 0;
	x = 0;
	y = 0;
	linear_Damping = 0;
	onLoad() {
		this.init();
	}
	init() {
		let world_y = cc.director.getPhysicsManager().gravity.y;
		let world_x = cc.director.getPhysicsManager().gravity.x;
		this.a_y =
			(-this.RigidBody.gravityScale * world_y) /
			cc.PhysicsManager.PTM_RATIO;
		this.a_x =
			(this.RigidBody.gravityScale * world_x) /
			cc.PhysicsManager.PTM_RATIO;
		this.v_y =
			-this.RigidBody.linearVelocity.y / cc.PhysicsManager.PTM_RATIO;
		this.v_x =
			this.RigidBody.linearVelocity.x / cc.PhysicsManager.PTM_RATIO;
		this.x = this.RigidBody.node.x;
		this.y = this.RigidBody.node.y;
		this.linear_Damping = this.RigidBody.linearDamping;
	}

	start() {
		this.node.removeChild(this.RigidBody.node, false);
		this.node.addChild(this.RigidBody.node, 9999);
		let size = cc.view.getVisibleSize();
		for (let index = 0; index < 50; index++) {
			let tmp = cc.instantiate(this.show_prefab);
			this.node.addChild(tmp);
			tmp.x = this.x;
			tmp.y = this.y;
			this.updateX(0.1);
			this.updateY(0.1);
		}
	}
	updateX(dt) {
		let damping = -this.linear_Damping * this.v_x * dt;
		this.x += this.s(this.v_x, this.a_x, dt) * cc.PhysicsManager.PTM_RATIO;
		this.v_x = this.v(this.v_x, this.a_x, dt) + damping;
	}
	updateY(dt) {
		let damping = -this.linear_Damping * this.v_y * dt;
		this.y -= this.s(this.v_y, this.a_y, dt) * cc.PhysicsManager.PTM_RATIO;
		this.v_y = this.v(this.v_y, this.a_y, dt) + damping;
	}
	update(dt) {
		// let tmp = cc.instantiate(this.show_prefab);
		// this.node.addChild(tmp);
		// tmp.x = this.x;
		// tmp.y = this.y;
		// this.updateX(dt);
		// this.updateY(dt);
		// console.log(
		// 	(this.x - this.RigidBody.node.x) / dt,
		// 	(this.y - this.RigidBody.node.y) / dt
		// );
	}

	v(v0, a, t) {
		return v0 + a * t;
	}
	s(v0, a, t) {
		return v0 * t + (a * t * t) / 2;
	}
	d(v0, v, a) {
		return (v * v - v0 * v0) / (2 * a);
	}
}
