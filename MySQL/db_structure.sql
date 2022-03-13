SET SQL_SAFE_UPDATES = 0; -- to update or delete items from table set to 0 else 1 for safe mode

create table userdetails(
	username varchar(50) not null primary key,
    password varchar(32)
);

create table TeamTable(
	team_id int auto_increment primary key,
    team_name varchar(50),
    team_code varchar(10)
);

create table SquadTable(
	player_id int auto_increment primary key,
    player_name varchar(60),
    team_id int,
    foreign key(team_id) references TeamTable(team_id)
);

create table FixtureTable(
	fixture_id int auto_increment primary key,
    teamA_id int,
    teamB_id int,
    winner varchar(50),
    fixture_date datetime,
    teamA_score int,
    teamB_score int,
    foreign key(teamA_id) references TeamTable(team_id),
    foreign key(teamB_id) references TeamTable(team_id)
);

create table TeamsPastPerformance(
	performance_id int auto_increment primary key,
    fixture_id int,
    foreign key(fixture_id) references FixtureTable(fixture_id)
);

-- select * from TeamTable;
-- select * from SquadTable;
-- select * from FixtureTable;
-- select * from TeamsPastPerformance;

-- drop table TeamTable;
-- drop table SquadTable;
-- drop table FixtureTable;
-- drop table TeamsPastPerformance;

-- delete from TeamTable;