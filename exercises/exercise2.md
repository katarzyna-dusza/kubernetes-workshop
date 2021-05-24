# Exercise 2 - Create a Deployment

Now that you know how to launch a single Pod, lets do it in a more practical
way by creating a deployment. Here is a sample definition:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: CHANGE_ME
  labels:
    application: CHANGE_ME
    training: kubernetes-workshop
spec:
  replicas: 1
  selector:
    matchLabels:
      application: CHANGE_ME
  template:
    metadata:
      labels:
        application: CHANGE_ME
    spec:
      containers:
      - name: main
        image: nginx
        env:
        - name: USER
          value: CHANGE_ME
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
        resources:
          requests:
            cpu: "20m" # REQUESTED CPU: 20m cores
            memory: "20M" # REQUESTED MEM: 20MB
          limits:
            cpu: 0.5 # MAX CPU USAGE: 0.5 core
            memory: "20M" # MAX MEM USAGE: 20MB
```

In the deployment we declare:

* Its `name`;
* How many Pod `replicas` should be running;
* A `template`, specifying how Pods are created.

As with every other resource of the same `kind`, deployments __MUST__ have a
unique `name`.

## I. Create a Deployment Specification

Create a file `deployment.yaml` with the contents in the example above and
modify it to meet the following requirements:

* The `name` of this deployment should be your username, as in the previous
  exercise;
* The `spec` of our Pod `template` should be exactly the same as the `spec`
  from the Pod created in the previous exercise;
* All of our resources should have a label identified by `application`, and
  your username as value.

## II. Create the Deployment in the Cluster

To create the deployment we again use `kubectl apply`. As you may have already
noticed, this command is used to create or update _any_ Kubernetes resource.
Since our Deployment is declared in a file, we have to use the `-f` switch:

```
kubectl apply -f deployment.yaml
```

When successful the command returns with a message stating that the Deployment
was created.

## III. Verify that your Deployment was Created

To list all deployments in the cluster we execute `kubectl get deployment`.
We can also specify a single deployment as a parameter:

```
kubectl get deployment <deployment-name>
```

You should get your deployment listed, with the number of Desired, Current,
Up-to-Date and Available Pods all set to 1.

Lets now check on our Pods. We could list all of them in the cluster and find
it afterwards but we're doing it in a smarter way, by using label selectors.
Lets use the label `application` that we defined in our `deployment.yaml`. We
can use the switch '-l' for this purpose:

```
kubectl get pod -l application=<value>
```

Replace the `<value>` part of the previous command with the value you defined
for the label in the YAML. You will get a list similar to this:

```
NAME                    READY     STATUS    RESTARTS   AGE
myapp-b9675b645-cp2lv   1/1       Running   0          3h
```

In your case, the name of the Pod is prepended with the deployment name.

__EXTRA__: Delete the Pod listed. What happens?

## IV. Scale up your Deployment

The typical use for a deployment is to have more than one Pod running, so your
application can scale multiple requests. Lets then configure ours ta have 3
Pods running.

* Go to your `deployment.yaml` and modify the number of `replicas` from 1 to 3;
* Apply the changes with the same command from Step II. It will return with a
  confirmation that the deployment was configured with the updated values.

Check again your deployment and your Pods, as you did in Step III. You should
see that the deployment now has 3 Pods running, similar as shown below:

```
$ kubectl get pod -l application=myapp
NAME                     READY     STATUS    RESTARTS   AGE
myapp-7bf957476f-26nxp   1/1       Running   0          6m
myapp-7bf957476f-ght25   1/1       Running   0          6m
myapp-7bf957476f-ltwnp   1/1       Running   0          6m
```

You can also see that each Pod was given an unique name.

__EXTRA__: If you wanted to delete _all_ Pods from your deployment, what switch
would you use? What would happen?

## Other Useful Commands

* `kubectl get deployment <deployment-name> -o yaml` - returns detailed
  information about a deployment in YAML format;
* `kubectl describe deployment <deployment-name>` - similar to
  `kubectl get deployment`, but provides additional information like Events.
  Useful for debugging issues with deployments;
* `kubectl delete deployment <deployment-name>` - deletes a single deployment.

__NOTE__: Do not delete your current deployment, as you will need it for the
next exercise.
