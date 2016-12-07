from datetime import datetime, timedelta
import json
import pprint
pp = pprint.PrettyPrinter(indent=4)

# def test():
#     User1 = {
#         # 'id': 0,
#         # 'name': 'Ewing',
#         # 'email': 'ylin62@ucsc.edu',
#         'rooms': {
#             'bedroom':
#                 {
#                     'icon_path': '/bedroom.png',
#                     'device': 'tv,light,desktop,ac',
#                     'mod_header': 'activity,devices,graph,consumption,notification',
#                 },
#             'kitchen':
#                 {
#                     'icon_path': '/kitchen.png',
#                     'device': 'freezer,fridge,toaster,microwave,light',
#                     'mod_header': 'activity,devices,graph,consumption,notification',
#                 }
#         }
#     }
#     User1 = json.dumps(User1)
#
#     return response.json(dict(user=User1))


def get_data():
    today = datetime.utcnow()
    if request.get_vars.start is not None:
        start = request.vars.start
        start = start.split(',')
        start = datetime(int(start[0]),int(start[1]),int(start[2]))
        print(start)
    else:
        raise HTTP(400, "No room specified")
    if request.get_vars.end is not None:
        end = request.vars.end
        end = end.split(',')
        end = datetime(int(end[0]), int(end[1]), int(end[2]))
        print(end)
    else:
        end = None
    if request.get_vars.room is not None:
        room = request.vars.room
    else:
        raise HTTP(400,"No room specified")
    if request.get_vars.device is not None:
        device = request.vars.device
    else:
        raise HTTP(400, "No device specified")

    # text = 'connection success'
    data = []
    time = []
    if request.get_vars.end is None or request.get_vars.start == request.get_vars.end: #get one day from device usage
        rows = get_oneday(room, device, start)
        sum_hour = 0
        for i, r in enumerate(rows):
            # print(i)
            if (i+1) % 60 == 0:
                sum_hour += r.on_off
                data.append(sum_hour)
                # print(sum_hour)
                sum_hour = 0
            else:
                # print()
                sum_hour+=r.on_off
        time = ['0am','1am','2am','3am','4am','5am','6am',
                '7am','8am','9am','10am','11am','12pm',
                '1pm','2pm','3pm','4pm','5pm','6pm',
                '7pm','8pm','9pm','10pm','11pm']
        # print(time)
        # print(data)
    else: # get a time period from daily usage
        rows = get_period(room, device, start, end)
        for i, r in enumerate(rows):
            data.append(r.total_usage)
            time.append(r.use_day)

    return response.json(dict(
        device=device,
        data=data,
        time=time,
    ))

# def get_cost_per_h():
#     rows = db(db.energy_cost).select()
#     arr = []
#     for r in rows:
#         arr.append(dict(
#             device=r.device,
#             cost_per_h=r.cost_per_h,
#         ))
#     return response.json(dict(
#         device_cost=arr,
#     ))

def get_room_cost():
    rooms = ['Reserve For Home']
    row = db(db.user_info.user_id == request.vars.user_id).select().first()
    roomsDict = json.loads(row['rooms'])  #user_info
    for r in roomsDict:
        rooms.append(
            dict(
                room=r,
                icon_path=roomsDict[r]['icon_path'],
                device=roomsDict[r]['device'],
                mod_header=roomsDict[r]['mod_header'],
            )
        )
    rows = db(db.energy_cost).select()
    arr = []
    for r in rows:
        arr.append(dict(
            device=r.device,
            cost_per_h=r.cost_per_h,
        ))
    # print(rooms)
    return response.json(dict(
        rooms=rooms,
        device_cost=arr,
    ))


# @auth.requires_signature()
def add_room():
    row = db(db.user_info.user_id == request.vars.user_id).select().first()
    rooms = json.loads(row['rooms'])
    icon_path = request.vars.icon_path
    room_name = request.vars.room_name
    # device = request.vars.device
    # mod_header = request.vars.mod_header
    rooms[room_name] = {
        'icon_path': icon_path,
        'device': '',
        'mod_header': '',
    }
    rooms_str = json.dumps(rooms)
    # print(rooms_str)
    row.rooms = rooms_str
    row.update_record()

    # print(request.vars.new_room)
    # action_room.room = ",".join(request.post_vars.rooms)
    # action_room.update_record()
    # print("Insert success")
    return response.json(dict(
        rooms=rooms,
    ))

def add_mod():
    row = db(db.user_info.user_id == request.vars.user_id).select().first()
    rooms = json.loads(row['rooms'])
    # print(request.vars.mod_header)
    mod_header = request.vars.mod_header
    # print(type(mod_header))
    room_name = request.vars.room_name
    # print(rooms[room_name]['mod_header'])
    rooms[room_name]['mod_header'] = mod_header
    rooms_str = json.dumps(rooms)
    # print(rooms_str)
    row.rooms = rooms_str
    row.update_record()

    row = db(db.user_info.user_id == request.vars.user_id).select().first()
    rooms = json.loads(row['rooms'])
    # print(rooms[room_name]['mod_header'])
    return response.json(dict(
        rooms=rooms,
    ))


def get_oneday(room, dev, day):
    r = (db.device_usage.room == room)
    d = (db.device_usage.device == dev)
    s = (db.device_usage.use_time >= day)
    e = (db.device_usage.use_time < day+timedelta(days=1))
    rows = db(r & d & s & e).select(orderby=db.device_usage.use_time)
    return rows

def get_period(room, dev, start, end):
    r = (db.daily_usage.room == room)
    d = (db.daily_usage.device == dev)
    s = (db.daily_usage.use_day >= start)
    e = (db.daily_usage.use_day <= end)
    rows = db(r & d & s & e).select(orderby=db.daily_usage.use_day)
    return rows

# def rows_to_dict_getRoom(row):
#     rowDict = json.loads(row['rooms'])
#     return rowDict