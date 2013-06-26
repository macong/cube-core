package org.cube.core.uom.service;

import javax.annotation.Resource;

import org.cube.core.common.base.BaseDao;
import org.cube.core.common.base.BaseService;
import org.cube.core.uom.model.User;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

//Spring Bean的标识.
@Component
// 默认将类中的所有public函数纳入事务管理.
@Transactional(readOnly = true)
public class UserManager extends BaseService<User> {

	@Resource(name = "userDao")
	public void setBaseDao(BaseDao<User> baseDao) {
		this.baseDao = baseDao;
	}
}
