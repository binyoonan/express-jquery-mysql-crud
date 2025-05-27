# Express.js MySQL CRUD 애플리케이션 (Kubernetes 배포)

이 프로젝트는 Express.js, MySQL, jQuery를 사용한 CRUD 애플리케이션을 쿠버네티스에 배포하는 예제입니다.

## 쿠버네티스 설정 파일 설명

### 1. MySQL 영구 볼륨 (mysql-pv.yaml)
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt/data/mysql
```
- MySQL 데이터를 저장하기 위한 1GB 크기의 영구 볼륨을 생성합니다
- `hostPath`를 사용하여 노드의 파일시스템에 데이터를 저장합니다
- `ReadWriteOnce` 접근 모드로 설정하여 단일 노드에서만 읽기/쓰기가 가능하도록 합니다

### 2. MySQL 영구 볼륨 클레임 (mysql-pvc.yaml)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```
- MySQL이 사용할 영구 볼륨을 요청합니다
- 1GB의 저장 공간을 요청합니다
- PV와 동일한 접근 모드(ReadWriteOnce)를 사용합니다

### 3. MySQL 디플로이먼트 (mysql-deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - image: mysql:8.0
          name: mysql
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "password"
            - name: MYSQL_DATABASE
              value: "crud_db"
          ports:
            - containerPort: 3306
              name: mysql
          volumeMounts:
            - name: mysql-storage
              mountPath: /var/lib/mysql
      volumes:
        - name: mysql-storage
          persistentVolumeClaim:
            claimName: mysql-pvc
```
- MySQL 8.0 컨테이너를 배포합니다
- 상태가 있는 애플리케이션이므로 `Recreate` 전략을 사용합니다
- 루트 비밀번호와 데이터베이스 이름을 환경 변수로 설정합니다
- 영구 볼륨을 `/var/lib/mysql`에 마운트합니다
- 3306 포트를 통해 데이터베이스 연결을 제공합니다

### 4. MySQL 서비스 (mysql-service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  selector:
    app: mysql
  ports:
    - port: 3306
      targetPort: 3306
```
- MySQL을 위한 서비스를 생성합니다
- 클러스터 내부에서 3306 포트로 접근 가능합니다
- 다른 파드에서 서비스 이름으로 MySQL에 접근할 수 있습니다

### 5. Express.js 디플로이먼트 (express-deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: express-app
  template:
    metadata:
      labels:
        app: express-app
    spec:
      containers:
        - name: express-app
          image: binyoonan/express-mysql-crud:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: MYSQL_PORT
              value: "3306"
            - name: MYSQL_HOST
              value: "mysql"
            - name: MYSQL_USER
              value: "root"
            - name: MYSQL_PASSWORD
              value: "password"
            - name: MYSQL_DATABASE
              value: "crud_db"
            - name: CORS_ORIGIN
              value: "*"
```
- Express.js 애플리케이션을 배포합니다
- 커스텀 Docker 이미지를 사용합니다
- MySQL 연결을 위한 환경 변수들을 설정합니다
- 웹 애플리케이션을 위해 3000 포트를 노출합니다

### 6. Express.js 서비스 (express-service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: express-service
spec:
  type: NodePort
  selector:
    app: express-app
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30080
```
- Express.js 애플리케이션을 위한 NodePort 서비스를 생성합니다
- 외부에서 30080 포트로 접근 가능합니다
- 내부적으로는 Express.js 컨테이너의 3000 포트로 트래픽을 전달합니다

## 배포 방법

1. 다음 순서대로 설정을 적용합니다:
   ```bash
   kubectl apply -f k8s/mysql-pv.yaml
   kubectl apply -f k8s/mysql-pvc.yaml
   kubectl apply -f k8s/mysql-deployment.yaml
   kubectl apply -f k8s/mysql-service.yaml
   kubectl apply -f k8s/express-deployment.yaml
   kubectl apply -f k8s/express-service.yaml
   ```

2. 애플리케이션 접근:
   - Express.js 애플리케이션: `http://<노드-IP>:30080`
   - MySQL 데이터베이스: 클러스터 내부에서 `mysql:3306`으로 접근

## 주의사항
- 쿠버네티스 노드에 `/mnt/data/mysql` 경로가 존재하는지 확인하세요
- MySQL 루트 비밀번호가 "password"로 설정되어 있습니다 - 프로덕션 환경에서는 변경하세요
- 애플리케이션은 30080 포트를 사용합니다 - 이미 사용 중인 포트라면 변경하세요
