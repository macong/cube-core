
package org.cube.core.uom.dao;

import org.cube.core.common.base.BaseDao;
import org.cube.core.uom.model.User;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao extends BaseDao<User> {
    
    /**
     * FIXME 方法注释信息(此标记由Eclipse自动生成,请填写注释信息删除此标记)
     * 
     * @param name
     * @return
     */
    public User findByRealName(String name) {
        return this.findList("from Users where realName=?", name).get(0);
    }
    
    /**
     * FIXME 方法注释信息(此标记由Eclipse自动生成,请填写注释信息删除此标记)
     * 
     * @param userName
     * @return
     */
    public User findByUserName(String userName) {
        return this.findList("from Users where userName=?", userName).get(0);
    }
    
}
