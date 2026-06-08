// src/types/models/user-info.types.ts
export var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["SECRET"] = "SECRET";
})(Gender || (Gender = {}));
export var UserState;
(function (UserState) {
    UserState["ACTIVE"] = "ACTIVE";
    UserState["INACTIVE"] = "INACTIVE";
    UserState["SUSPENDED"] = "SUSPENDED";
    UserState["PENDING"] = "PENDING";
})(UserState || (UserState = {}));
