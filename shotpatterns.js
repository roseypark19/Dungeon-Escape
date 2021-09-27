const SHOT_PATTERNS = {

    // hero weapon projectile behavior
    0: function(projectile) {
        if (projectile.updateVectorPoint()) {
            projectile.x = projectile.vectorPoint.x;
            projectile.y = projectile.vectorPoint.y;
        } else {
            projectile.removeFromWorld = true;
        } 
    },

    // sin-wave behavior
    1: function(projectile) {
        if (projectile.updateVectorPoint()) {
            let radians = distance(projectile.vectorPoint, projectile.originPoint) / projectile.range * 8 * Math.PI;
            let shift = Math.sin(radians) * 75;
            // we need to find a unit vector perpendicular to the velocity vector
            let perpVect = {x: projectile.velocity.y, y: -projectile.velocity.x};
            let unitPerpVect = unitVector(perpVect);
            projectile.x = projectile.vectorPoint.x + unitPerpVect.x * shift;
            projectile.y = projectile.vectorPoint.y + unitPerpVect.y * shift;
        } else {
            projectile.removeFromWorld = true;
        } 
    },

    // randomized arc behavior
    2: function(projectile) {
        if (!projectile.arcDirection) projectile.arcDirection = randomInt(2) === 0 ? -1 : 1;
        if (projectile.updateVectorPoint()) {
            let radians = distance(projectile.vectorPoint, projectile.originPoint) / projectile.range * Math.PI;
            let shift = Math.sin(radians) * 125 * projectile.arcDirection;
            // we need to find a unit vector perpendicular to the velocity vector
            let perpVect = {x: projectile.velocity.y, y: -projectile.velocity.x};
            let unitPerpVect = unitVector(perpVect);
            projectile.x = projectile.vectorPoint.x + unitPerpVect.x * shift;
            projectile.y = projectile.vectorPoint.y + unitPerpVect.y * shift;
        } else {
            projectile.removeFromWorld = true;
        } 
    },

    // spiral of archimedes behavior
    3: function(projectile) {
        let rotations = 5;
        if (!projectile.angularVel) projectile.angularVel = magnitude(projectile.velocity) / projectile.range * Math.PI;
        projectile.theta = projectile.theta ? projectile.theta - projectile.angularVel : 2 * Math.PI * rotations + Math.PI;
        if (projectile.theta >= Math.PI) {
            let radius = projectile.theta / (2 * Math.PI * rotations + Math.PI) * projectile.range / 2;
            let unitVect = unitVector(projectile.velocity);
            let origin = {x: projectile.originPoint.x + unitVect.x * projectile.range / 2, 
                          y: projectile.originPoint.y + unitVect.y * projectile.range / 2};
            // utilizing the angle sum rule -> this gives us a unit vector rotated by theta radians
            let rotatedUnitVect = {x: Math.cos(projectile.theta) * unitVect.x - Math.sin(projectile.theta) * unitVect.y,
                                   y: Math.sin(projectile.theta) * unitVect.x + Math.cos(projectile.theta) * unitVect.y};
            projectile.x = origin.x + rotatedUnitVect.x * radius;
            projectile.y = origin.y + rotatedUnitVect.y * radius;
        } else {
            projectile.removeFromWorld = true;
        }
    },

    // boomerang behavior
    4: function(projectile) {
        if (projectile.reverse) {
            projectile.updateVectorPoint();
            if (distance(projectile.vectorPoint, projectile.getLinearDestination()) > projectile.range) {
                projectile.removeFromWorld = true;
            }
        } else {
            if (!projectile.updateVectorPoint()) {
                projectile.reverse = true;
                projectile.velocity = {x: -projectile.velocity.x, y: -projectile.velocity.y};
                projectile.updateVectorPoint();
            }      
        }
        if (!projectile.removeFromWorld) {
            projectile.x = projectile.vectorPoint.x;
            projectile.y = projectile.vectorPoint.y;
        }
    }
};