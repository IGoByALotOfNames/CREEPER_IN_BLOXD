/*
	tick onClose onPlayerJoin onPlayerLeave onPlayerJump onRespawnRequest
	playerCommand onPlayerChat onPlayerChangeBlock onPlayerDropItem
	onPlayerPickedUpItem onPlayerSelectInventorySlot onBlockStand
	onPlayerAttemptCraft onPlayerCraft onPlayerAttemptOpenChest
	onPlayerOpenedChest onPlayerMoveItemOutOfInventory onPlayerMoveInvenItem
	onPlayerMoveItemIntoIdxs onPlayerSwapInvenSlots onPlayerMoveInvenItemWithAmt
	onPlayerAttemptAltAction onPlayerAltAction onPlayerClick
	onClientOptionUpdated onInventoryUpdated onChestUpdated onWorldChangeBlock
	onCreateBloxdMeshEntity onEntityCollision onPlayerAttemptSpawnMob
	onWorldAttemptSpawnMob onPlayerSpawnMob onWorldSpawnMob onMobDespawned
	onPlayerAttack onPlayerDamagingOtherPlayer onPlayerDamagingMob
	onMobDamagingPlayer onMobDamagingOtherMob onPlayerKilledOtherPlayer
	onMobKilledPlayer onPlayerKilledMob onMobKilledOtherMob onPlayerPotionEffect
	onPlayerDamagingMeshEntity onPlayerBreakMeshEntity onPlayerUsedThrowable
	onPlayerThrowableHitTerrain onTouchscreenActionButton onTaskClaimed
	onChunkLoaded onPlayerRequestChunk onItemDropCreated
	onPlayerStartChargingItem onPlayerFinishChargingItem doPeriodicSave

	To use a callback, just assign a function to it in the world code!
	tick = () => {}			 or			 function tick() {}
*/
q=1
prob = 100
creep = []
function ptc([x,y,z]){
    api.playParticleEffect({
        dir1: [-1, -1, -1],
        dir2: [1, 1, 1],
        pos1: [x, y, z],
        pos2: [x, y, z],
        texture: "square_particle",
        minLifeTime: 0.3,
        maxLifeTime: 0.5,
        minEmitPower: .2,
        maxEmitPower: .8,
        minSize: 0.15,
        maxSize: 0.20,
        manualEmitCount: 500,
        gravity: [0, 0, 0],
        colorGradients: [
            {
                timeFraction: 0,
                minColor: [100,100,100, .8],
                maxColor: [50,50,50, 1],
            },
        ],
        velocityGradients: [
            {
                timeFraction: 15,
                factor: 15,
                factor2: 15,
            },
        ],
        blendMode: 1,
    })
    api.playParticleEffect({
        dir1: [-1, -1, -1],
        dir2: [1, 1, 1],
        pos1: [x, y, z],
        pos2: [x, y, z],
        texture: "generic_2",
        minLifeTime: .2,
        maxLifeTime: .5,
        minEmitPower: 2,
        maxEmitPower: 2,
        minSize: .5,
        maxSize: 1,
        manualEmitCount: 50,
        gravity: [0, 0, 0],
        colorGradients: [
            {
                timeFraction: 0,
                minColor: [255,255,255, 1],
                maxColor: [255,255,255, 1],
            },
        ],
        velocityGradients: [
            {
                timeFraction: 15,
                factor:15,
                factor2: 15,
            },
        ],
        blendMode: 1,
    })
}
function onMobDamagingPlayer(mob, id, dmg, itm){
	api.applyHealthChange(id, dmg)
	
}
function onEntityCollision(eid,ei){
	api.log(eid,ei)
}
function onCreateBloxdMeshEntity(id, tp){
	api.log(id,tp)
}
function onWorldSpawnMob(id, type){
	rand = Math.random()<0.5
	
	if (rand && type==="Draugr Zombie"){
		creep.push(id)
	}
}
function onPlayerSpawnMob(id,id1, type){
	rand = Math.random()<0.5
	
	if (rand && type==="Draugr Zombie"){
		creep.push(id1)
	}

}
function explode1(coord1, coord2){
	mid = [(coord1[0]+coord2[0])/2,(coord1[1]+coord2[1])/2,(coord1[2]+coord2[2])/2]
    for (x=coord1[0];x<coord2[0];x++){
        for (y=coord1[1];y<coord2[1];y++){
            for (z=coord1[2];z<coord2[2];z++){
				
            /* api.log(x,y,z) */
                curBlock = api.getBlock(x,y,z)
                
                if (curBlock !== "Obsidian" && curBlock !== "Bedrock" ){
					dister = Math.sqrt(Math.pow(x-mid[0],2)+Math.pow(y-mid[1],2)+Math.pow(z-mid[2],2))
                    
					if (dister < 4){
						
                		api.setBlock(x,y,z,"Air")
					}
                }
                
                
            }
        }
    }
    
}
function onPlayerJoin(id1){
	api.updateEntityNodeMeshAttachment(id1, "HeadMesh", "BloxdBlock", {blockName:"Grass Block", size:1, meshOffset:[0, 0, 0]}, [0, 0,  0], [0,0,0])
}
timer={}
tasks=[]
cntt = 0
function calcDim(dist){
    return (-20*dist)+130
}
function tick(){
	cntt++
	creep.forEach(id=>{
        try{
			
            POS=api.getPosition(id)
            inr = api.getEntitiesInRect([POS[0]-3,POS[1],POS[2]-3],[POS[0]+3,POS[1]+1,POS[2]+3])
			
            inr=inr.filter(i=>i!==id)
            inr.forEach(id1=>{
                pp = api.getPosition(id1)
                dst = Math.sqrt(Math.pow(POS[0]-pp[0],2)+Math.pow(POS[1]-pp[1],2)+Math.pow(POS[2]-pp[2],2))
                if (dst < 3){
                    api.applyEffect(id, "Frozen", null, {inbuiltLevel:1})
                    
                }
                
            })
			api.updateEntityNodeMeshAttachment(id, "HeadMesh", "BloxdBlock", {blockName:"Furnace", size:1, meshOffset:[0, 0, 0]}, [0, .23,  0], [3.14,0,0])
            if (inr.length===0){
				timer[id]=5
				
				api.removeEffect(id, "Frozen")
				api.updateEntityNodeMeshAttachment(id, "TorsoNode", "BloxdBlock", {blockName:"Moonstone Explosive", size:1.5, meshOffset:[0, 0, 0]}, [0, 0.1,  0], [0,0,0])
			}else{
				if (cntt%10===0){
					if (timer[id] % 2 !== 0){
						api.updateEntityNodeMeshAttachment(id, "TorsoNode", "BloxdBlock", {blockName:"Moonstone Explosive", size:1.5, meshOffset:[0, 0, 0]}, [0, 0.1,  0], [0,0,0])
					}else{
						api.updateEntityNodeMeshAttachment(id, "TorsoNode", "BloxdBlock", {blockName:"Snow", size:1.55, meshOffset:[0, 0, 0]}, [0, 0.1,  0], [0,0,0])
					}
					if (timer[id] > 0){
						timer[id]--;
                        inr.forEach(id=>{
                            api.playSound(id,"beep",1,4)
                        })
					}else{

                        tasks.push([id,POS])

                        

                            
                        

                        
                        ptc([POS[0],POS[1]+0.5,POS[2]])
                        dmg=100
                        
                        
                       

					}
				}
			}
			

        }catch{

            creep=creep.filter(el=>el!==id)

        }
	})
    tasks.forEach(e=>{

        el=e[1]
        id=e[0]
        explode1([el[0]-5,el[1]-5,el[2]-5],[el[0]+4,el[1]+4,el[2]+4])
        inr1 = api.getEntitiesInRect([POS[0]-4,POS[1],POS[2]-4],[POS[0]+5,POS[1]+1,POS[2]+5])
        inr1 = inr1.filter(el=>el!==id)
        inr1.forEach(id1=>{
            
            if (api.getPlayerIds().includes(id1) || api.getMobIds().includes(id1)){
                pp = api.getPosition(id1)
                /*force=api.calcExplosionForce(id, 1, 1, 5, pp, true).force
                api.applyImpulse(id1, ...force)*/
                api.applyHealthChange(id1, -Math.round(calcDim(Math.sqrt(Math.pow(el[0]-pp[0],2)+Math.pow(el[1]-pp[1],2)+Math.pow(el[2]-pp[2],2)))), {lifeformId: id, withItem:"Moonstone Explosive"})
            }
        })
        api.killLifeform(id)
        tasks=tasks.filter(ei=>ei!==e)
    })
}
