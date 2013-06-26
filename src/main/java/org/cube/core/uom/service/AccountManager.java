
package org.cube.core.uom.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.cube.core.common.orm.Hibernates;
import org.cube.core.security.ShiroDbRealm;
import org.cube.core.security.ShiroDbRealm.HashPassword;
import org.cube.core.uom.dao.UserDao;
import org.cube.core.uom.model.User;
import org.hibernate.service.spi.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户管理类.
 * 
 * @author calvin
 */
// Spring Service Bean的标识.
@Component
@Transactional(readOnly = true)
public class AccountManager {
    
    private static Logger logger = LoggerFactory.getLogger(AccountManager.class);
    
    private UserDao userDao;
    
    private ShiroDbRealm shiroRealm;
    
    /**
     * 在保存用户时,发送用户修改通知消息, 由消息接收者异步进行较为耗时的通知邮件发送. 如果企图修改超级用户,取出当前操作员用户,打印其信息然后抛出异常.
     */
    @Transactional(readOnly = false)
    public void saveUser(User user) {
        
        if (this.isSupervisor(user)) {
            logger.warn("操作员{}尝试修改超级管理员用户", SecurityUtils.getSubject().getPrincipal());
            throw new ServiceException("不能修改超级管理员用户");
        }
        
        // 设定安全的密码，使用passwordService提供的salt并经过1024次 sha-1 hash
        if (StringUtils.isNotBlank(user.getPlainPassword()) && this.shiroRealm != null) {
            HashPassword hashPassword = this.shiroRealm.encrypt(user.getPlainPassword());
            user.setSalt(hashPassword.salt);
            user.setUserPassword(hashPassword.password);
        }
        
        this.userDao.save(user);
        
        if (this.shiroRealm != null) {
            this.shiroRealm.clearCachedAuthorizationInfo(user.getUserName());
        }
        
    }
    
    public List<User> getAllUser() {
        return this.userDao.findAll();
    }
    
    public List<User> getAllUserInitialized() {
        List<User> result = this.userDao.findAll();
        for (User user : result) {
            Hibernates.initLazyProperty(user.getRoleList());
        }
        return result;
    }
    
    /**
     * 判断是否超级管理员.
     */
    private boolean isSupervisor(User user) {
        return (user.getUserId() != null && "admin".equals(user.getUserName()));
    }
    
    public User getUser(long id) {
        return this.userDao.find(id);
    }
    
    /**
     * 取得用户，先尝试从缓存获取，然后用查询.
     */
    public User getUserEffective(long id) {
        return this.userDao.find(id);
    }
    
    /**
     * 按名称查询用户, 并对用户的延迟加载关联进行初始化.
     */
    public User findUserByNameInitialized(String name) {
        User user = this.userDao.findByRealName(name);
        if (user != null) {
            Hibernates.initLazyProperty(user.getRoleList());
        }
        return user;
    }
    
    /**
     * 获取当前用户数量.
     */
    public long getUserCount() {
        return this.userDao.count();
    }
    
    public User findUserByLoginName(String loginName) {
        return this.userDao.findByUserName(loginName);
    }
    
    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
    
    @Autowired(required = false)
    public void setShiroRealm(ShiroDbRealm shiroRealm) {
        this.shiroRealm = shiroRealm;
    }
}
