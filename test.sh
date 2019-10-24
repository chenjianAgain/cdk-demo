#!/bin/sh
for i in {1..50}
do
  echo "Looping ... number $i"
  wget http://ecs-fargate-1pxa235ugzki2-812246400.us-west-2.elb.amazonaws.com/
done
