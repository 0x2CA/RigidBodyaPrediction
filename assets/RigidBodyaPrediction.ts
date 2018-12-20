const { ccclass, property } = cc._decorator;

@ccclass
export default class RigidBodyaPrediction extends cc.Component {
	@property(cc.RigidBody)
	RigidBody: cc.RigidBody = null;

	@property(cc.Prefab)
	show_prefab: cc.Prefab = null;

	@property(cc.Node)
	result: cc.Node = null;
	// LIFE-CYCLE CALLBACKS:
	//米/秒^2
	a_y = 0;
	a_x = 0;
	//米/秒
	v_y = 0;
	v_x = 0;
	//位置
	x = 0;
	y = 0;
	//阻尼
	linear_Damping = 0;

	status = true;

	pool: cc.Node[] = new Array<cc.Node>();

	onLoad() {
		for (let index = 0; index < 25; index++) {
			let tmp = cc.instantiate(this.show_prefab);
			this.pool.push(tmp);
			this.result.addChild(tmp);
		}
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
		this.RigidBody.node.on(
			cc.Node.EventType.TOUCH_CANCEL,
			function() {
				this.RigidBody.type = cc.RigidBodyType.Dynamic;
				this.status = false;
			},
			this
		);
		this.RigidBody.node.on(
			cc.Node.EventType.TOUCH_MOVE,
			function(event: cc.Touch) {
				let vec2 = this.RigidBody.node.convertToNodeSpaceAR(
					event.getLocation()
				);
				this.RigidBody.linearVelocity = new cc.Vec2(
					-vec2.x,
					-vec2.y * 2
				);
			},
			this
		);
	}

	show() {
		this.init();
		this.node.removeChild(this.RigidBody.node, false);
		this.node.addChild(this.RigidBody.node, 9999);
		for (let index = 0; index < 25; index++) {
			let tmp = this.pool[index];
			tmp.x = this.x;
			tmp.y = this.y;
			this.updatePostion(0.15);
		}
	}
	updateX(dt) {
		this.x += this.s(this.v_x, this.a_x, dt) * cc.PhysicsManager.PTM_RATIO;
		let damping = -this.linear_Damping * this.v_x * dt;
		this.v_x = this.v(this.v_x, this.a_x, dt) + damping;
	}
	updateY(dt) {
		this.y -= this.s(this.v_y, this.a_y, dt) * cc.PhysicsManager.PTM_RATIO;
		let damping = -this.linear_Damping * this.v_y * dt;
		this.v_y = this.v(this.v_y, this.a_y, dt) + damping;
	}
	updatePostion(dt) {
		this.updateX(dt);
		this.updateY(dt);
	}

	v(v0, a, t) {
		return v0 + a * t;
	}
	s(v0, a, t) {
		return v0 * t + (a * t * t) / 2;
	}
	update() {
		if (this.status) {
			this.show();
		}
	}
}
