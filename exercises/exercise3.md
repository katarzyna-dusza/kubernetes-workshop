# Exercise 3 - Create a Service

Lets now create a service for our Pods. The following shows a sample definition
in YAML.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: CHANGE_ME
  labels:
    application: CHANGE_ME
    training: kubernetes-workshop
spec:
  selector:
    application: CHANGE_ME
  type: NodePort
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

This Service definition declares:

* Its `name`;
  * Additionally, a label is defined so it can be selected by other resources;
* Which Pods it serves, through the `application` label in the `spec`;
* Its `type`;
* The service `port` and `protocol`;
* The `targetPort` of the Pods it is serving.

## I. Create a Service Definition

Create a file `service.yaml` with the contents in the example above and
modify it to meet the following requirements:

* The `name` of this service should be your username;
* Our service should be selectable through an `application` label with your
  username as the value;
* We want to point our service to the Pods from our deployment;
* Our Pods' `targetPort` is already 8080, so we can keep it.

## II. Create the Service

Once you have your service defined, you can create it through `kubectl apply`:

```
kubectl apply -f service.yaml
```

When successful the command returns with a message stating that the Service was
created.

## III. Verify that your Service was Created

To list all services in the cluster we execute `kubectl get service`.
We can also specify a single service as a parameter:

```
kubectl get service <service-name>
```

It will show information about your service, including its Cluster IP and port,
as defined in the service definition YAML.

## IV. Verify that your Service is Pointing to the Right Pods

Lets now take a look to which Pods is this service pointing. For this we can
use `kubectl describe service <service-name>`. Among other info it will show
to which endpoints the service is configured, similar to the following (output
is truncated for brevity):

```
$ kubectl describe service myapp
Name:              myapp
.
Endpoints:         10.2.5.11:8080,10.2.7.27:8080,10.2.8.92:8080
.
```

Take note of the endpoints shown. Now check the IPs of our Pods using
`kubectl get pod` with the `-o wide` switch, to show additional information
like the following example:

```
$ kubectl get pod -l application=myapp -o wide
NAME                     READY     STATUS    RESTARTS   AGE       IP          NODE
myapp-7bf957476f-26nxp   1/1       Running   0          3h        10.2.7.27   ip-172-31-0-87.eu-central-1.compute.internal
myapp-7bf957476f-ght25   1/1       Running   0          3h        10.2.5.11   ip-172-31-18-84.eu-central-1.compute.internal
myapp-7bf957476f-ltwnp   1/1       Running   0          3h        10.2.8.92   ip-172-31-9-31.eu-central-1.compute.internal
```

As you can see the Pods' IPs match the ones from your Service.

__EXTRA__: Delete one (or more) Pods, and check the Service's endpoints again.
What's the result?

## Other Useful Commands

* `kubectl get service <service-name> -o yaml` - returns detailed information
  about a service in YAML format.
