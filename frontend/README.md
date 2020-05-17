
# Data 최신으로 업데이트
```shell script
# 실행 위치 : 현재폴더 (./frontend)
$ python setup.py
```

# Config file 생성
`./frontend/config.py` :
```python
SECRET_KEY = "I_LOVE_YOU_MC"  # change string and add this line to config.py 
```


# Flask 실행
```shell script
$ export FLASK_APP=app.py
$ export FLASK_ENV=development
$ flask run
```
혹은
```shell script
$ python app.python
```