# Exercise 4 - Expose Your Application through an Ingress

Finally we are going to expose our application to the public Internet through
the definition of an Ingress resource. Here's a sample definition in YAML:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: CHANGE_ME
  labels:
    application: CHANGE_ME
    training: kubernetes
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/group.name: group-name
spec:
  rules:
  - host: "CHANGE_ME.kasia-dusza.de"
    http:
      paths:
      - backend:
          serviceName: CHANGE_ME
          servicePort: 80
```

This Ingress definition declares:

* Its `name`;
* The public DNS `host`;
* Its `backend`, defined by a `serviceName` and `servicePort`.
* `group-name` - fill it out with a value provided by the trainer
## I. Create a Ingress Definition

Create a file `ingress.yaml` with the contents in the example above and
modify it to meet the following requirements:

* The `name` of this Ingress should be your username;
* Our Ingress should have a label identified by `application`, and your
  username as value;
* Its `host` should also be your username, followed by `.kasia-dusza.de`;
* The `backend` should be the Service created in the previous exercise.

## II. Create the Ingress

Once you have your ingress defined, you can create it through `kubectl apply`:

```
kubectl apply -f ingress.yaml
```

When successful the command returns with a message stating that the Ingress was
created.

## III. Verify that your Ingress was Created

To list all ingresses in the cluster we execute `kubectl get ingress`.
We can also specify a single ingress as a parameter:

```
kubectl get ingress <ingress-name>
```

It will show information about your ingress, including its DNS hostname and
Load Balancer address. This last one takes some time to appear, so it will
show empty for some time. Keep trying until it is shown.

## IV. Test the Application in a Browser

Now that your application is publicly exposed, you can test it is working
correctly. In a browser, open the URL defined in your Ingress definition. You
should see a simple page like the following:

![Browser Example](images/browserapp.png)

## Other Useful Commands

* `kubectl get ingress -o wide` - lists all ingresses without truncating the
  load balancer address;
* `kubectl get ingress <ingress-name> -o yaml` - returns detailed information
  about an ingress in YAML format.
