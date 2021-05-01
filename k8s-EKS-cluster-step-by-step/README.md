# Kubernetes Cluster (EKS) step by step tutorial

1. Create EKS cluster by running `eksctl` command. To do so, follow [this instruction](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html).
2. Add following changes to `aws-auth` under `mapRoles` key: `kubectl edit -n kube-system configmap/aws-auth`:
```
 mapRoles: |
  ....
  - groups:
      - system:bootstrappers
      - system:nodes
      - system:node-proxier
      rolearn: arn:aws:iam::<AWS_ACCOUNT_ID>:role/<USER_ROLE>
      username: arn:aws:iam::<AWS_ACCOUNT_ID>:user/<USER_NAME>
```
When you create an Amazon EKS cluster, the IAM entity user or role, such as a federated user that creates the cluster, is automatically granted system:masters permissions in the cluster's RBAC configuration in the control plane. This IAM entity does not appear in the ConfigMap, or any other visible configuration, so make sure to keep track of which IAM entity originally created the cluster. To grant additional AWS users or roles the ability to interact with your cluster, you must edit the aws-auth ConfigMap within Kubernetes.

See [AWS tutorial](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html) for more details.

3. Specify permissions for users:
- Apply example `cluster-role.yaml`: `kubectl apply -f cluster-role.yaml`
- Apply example `cluster-role-binding.yaml`: `kubectl apply -f cluster-role-binding.yaml`
4. Deploy aws-load-balancer-controller. To do so, follow [this instruction](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html).
5. If you want to reach out your application using hostnames and if you want to create them automatically whenever you create an ingress resource, 
    - Create new policy: `aws iam create-policy --policy-name AllowExternalDNSUpdates` --policy-document file://external-dns-iam-policy.json
    - Copy policy arn: arn:aws:iam::<AWS_ACCOUNT_ID>:policy/AllowExternalDNSUpdates
    - Create ServiceAccount:
    ```
    - eksctl create iamserviceaccount \
       --cluster=<CLUSTER_NAME> \
       --namespace=kube-system \
       --name=aws-load-balancer-controller \
       --attach-policy-arn=arn:aws:iam::AWS_ACCOUNT_ID>:policy/AllowExternalDNSUpdates \
       --override-existing-serviceaccounts \
       --approve 
    ```
    - Go to AWS Cloud Formation and find stack created by eksctl (iamserviceaccount with external-dns). Then go into details, find role and copy their ARN. Use this ARN in `external-dns.yaml` file
    - Apply example `external-dns.yaml`: `kubectl apply -f external-dns.yaml`.
    - Verify external DNS by creating Kubernetes resources. Use example ingress resource (with proper annotations): `kubectl apply -f ingress.yaml`

> If something went wrong and you are not able to delete existing ingress resources, this command might help: `kubectl patch ingress <name-of-the-ingress> -n <your-namespace> -p '{"metadata":{"finalizers":[]}}' --type=merge`